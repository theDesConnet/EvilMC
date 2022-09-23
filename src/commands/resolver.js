/** format */

const Command = require('../structure/command.js');
const Discord = require('discord.js');
const util = require('minecraft-server-util');
const hostValidattor = require('is-valid-hostname');

module.exports = new Command({
    name: "resolver",
    description: "Information about server",
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
        const port = args.getNumber("port");

        if (hostValidattor(host) == false) return crashers.errorembed(client, interaction, interaction.commandName, "Не валидный IP");

        if (!port) {
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
                        text: `${interaction.guild.name} | EvilMC`,
                        iconURL: `${client.user.displayAvatarURL(dynamic = true)}`
                    }
                })
    
                interaction.reply({embeds: [embed]});
            }).catch(() => {
                crashers.errorembed(client, interaction, interaction.commandName, "Данный сервер выключен!")
            })
        } else {
            util.status(host, port).then((responce) => {
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
                        text: `${interaction.guild.name} | EvilMC`,
                        iconURL: `${client.user.displayAvatarURL(dynamic = true)}`
                    }
                })
    
                interaction.reply({embeds: [embed]});
            }).catch(() => {
                crashers.errorembed(client, interaction, interaction.commandName, "Данный сервер выключен!")
            })
        }
    }
});