/** format */

const Command = require('../structure/command.js');
const util = require('minecraft-server-util');
//const hostValidattor = require('is-valid-hostname');
const crashers = require('../functions/crashers.js');
const Discord = require('discord.js');

module.exports = new Command({
    name: "resolver",
    description: "Information about server",
    permissions: "SEND_MESSAGES",
    disableOnAttack: false,
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
    }],
    async execute(client, args, interaction){
        const host = args.getString("host");
        const port = args.getNumber("port");

        interaction.deferReply({ fetchReply: true });

        try {
            let responce;

            if (!port) responce = await util.status(host)
            else responce = await util.status(host, port);

            let embed = new Discord.EmbedBuilder({
                author: {
                    name: `${client.language.getText("resolverTitle")} "${host}"`,
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
            }).setColor('Random');

            let b64, img, attachment;

            responce.favicon ? (
                b64 = responce.favicon.split(','),
                img = new Buffer.from(b64[1], 'base64'),
                attachment = new Discord.AttachmentBuilder(img, {name: 'srvIcon.png'}),
                embed.setThumbnail('attachment://srvIcon.png'),
                await interaction.editReply({embeds: [embed], files: [attachment]})
                ) : await interaction.editReply({embeds: [embed]});
        } catch (err) {
            await crashers.errorembed(client, interaction, interaction.commandName, `${err}`, true);
        }
    }
});