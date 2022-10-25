/** format */

const Command = require('../structure/command.js');
const Discord = require('discord.js');
const util = require('minecraft-server-util');
const hostValidattor = require('is-valid-hostname');
const crashers = require('../functions/crashers.js');

module.exports = new Command({
    name: "resolver",
    description: "Information about server",
    permissions: "SEND_MESSAGES",
    disableOnAttack: false,
    slashCommandOptions: [{
        name: "host",
        type: "STRING",
        description: "Enter host or ip server",
        required: true
    },{
        name: "port",
        description: "Enter port server",
        type: "NUMBER",
        required: false
    }],
    async execute(client, args, interaction){
        const host = args.getString("host");
        const port = args.getNumber("port");

        if (hostValidattor(host) == false) return crashers.errorembed(client, interaction, interaction.commandName, "Invalid IP");

        try {
            let responce;

            if (!port) responce = await util.status(host)
            else responce = await util.status(host, port);

            let embed = new Discord.MessageEmbed({
                color: 'RANDOM',
                author: {
                    name: `Server Information: "${host}"`,
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
                    value: `\`${responce.srvRecord ? responce.srvRecord.host ? responce.srvRecord.host : "NULL" : "NULL"}\``,
                    inline: true
                }, {
                    name: "Port",
                    value: `\`${responce.srvRecord ? responce.srvRecord.port ? responce.srvRecord.port : "NULL" : "NULL"}\``,
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

            let b64, img, attachment;

            responce.favicon ? (
                b64 = responce.favicon.split(','),
                img = new Buffer(b64[1], 'base64'),
                attachment = new Discord.MessageAttachment(img, 'srvIcon.png'),
                embed.setThumbnail('attachment://srvIcon.png'),
                interaction.reply({embeds: [embed], files: [attachment]})
                ) : interaction.reply({embeds: [embed]});
        } catch (err) {
            crashers.errorembed(client, interaction, interaction.commandName, `${err}`);
        }
    }
});
