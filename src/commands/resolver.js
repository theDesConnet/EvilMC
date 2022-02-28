/** format */

const Command = require('../structure/command.js');
const Discord = require('discord.js');
const util = require('minecraft-server-util');

module.exports = new Command({
    name: "resolver",
    description: "Info about server",
    permissions: "SEND_MESSAGES",
    async execute(client, args, message){
        const host = args[1];

        if (!host) errorembed("Вы не указали хост!");

        util.status(host).then((responce) => {
            let embed = new Discord.MessageEmbed({
                color: 'RANDOM',
                author: {
                    name: `Информация о сервере "${host}"`,
                },
                fields: [{
                    name: "Version",
                    value: `\`${responce.version.name}\``,
                    inline: true
                },{
                    name: "Protocol",
                    value: `\`${responce.version.protocol}\``,
                    inline: true
                },{
                    name: "MOTD",
                    value: `\`\`\`${responce.motd.clean}\`\`\``,
                    inline: false
                }, {
                    name: "IP",
                    value: `\`${responce.srvRecord.host}\``,
                    inline: true
                }, {
                    name: "Port",
                    value: `\`${responce.srvRecord.port}\``,
                    inline: true
                }, {
                    name: "Players",
                    value: `Online: \`${responce.players.online}\`\nMax: \`${responce.players.max}\``,
                    inline: true
                }],
                footer: {
                    text: `${message.guild.name} | EvilMC`,
                    icon_url: `${client.user.avatarURL('jpg')}`
                }
            })

            message.reply({embeds: [embed]});
        }).catch(() => {
            errorembed("Данный сервер выключен!")
        })
    }
});