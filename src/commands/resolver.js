const Command = require('../structure/command.js');
const Discord = require('discord.js');
const mp = require('minecraft-protocol');

module.exports = new Command({
    name: "resolver",
    description: "Get information about server!",
    slashCommandOptions: [{
        name: "host",
        description: "Server host",
        required: true,
        type: Discord.ApplicationCommandOptionType.String
    }, {
        name: "port",
        description: "Server port",
        required: false,
        type: Discord.ApplicationCommandOptionType.Number,
        minValue: 1,
        maxValue: 65536
    }, {
        name: "method",
        description: "Method resolving",
        required: false,
        type: Discord.ApplicationCommandOptionType.String,
        choices: [{
            name: "minecraft-protocol",
            value: "mprotocol"
        }, {
            name: "MultiAPI",
            value: "mapi"
        }]
    }],
    permissions: [Discord.PermissionFlagsBits.SendMessages],
    async execute(client, args, interaction) {
        const method = args.getString('method') ?? "mapi";
        const host = args.getString('host');
        const port = args.getNumber('port');
        let embed = new Discord.EmbedBuilder();
        let responce, attachment;

        await interaction.deferReply({ fetchReply: true })

        switch (method) {
            case "mapi":
                responce = await client.mineping.getInfo(port ? `${host}:${port}` : host);
                break

            case "mprotocol":
                responce = await mp.ping({ host: host, port: port }).then(() => responce.online = true);
                break
        }

        if (!responce.online) return client.errorembed(client, interaction, client.Language.getText("hostOfflineError"));

        embed
            .setAuthor({ name: `${client.Language.getText('resolverTitle')} ${host} ${port ?? ""}` })
            .setFields([{
                name: client.Language.getText('resolverVersion'),
                value: `\`${responce.version.name}\``,
                inline: true
            }, {
                name: client.Language.getText('resolverProtocol'),
                value: `\`${responce.version.protocol}\``,
                inline: true
            }, {
                name: client.Language.getText('resolverMOTD'),
                value: `\`\`\`${responce.motd ?? responce?.description?.text}\`\`\``,
                inline: false
            }, {
                name: client.Language.getText('resolverIP'),
                value: `\`${responce?.hostInfo?.ip ?? host}\``,
                inline: true
            }, {
                name: client.Language.getText('resolverPort'),
                value: `\`${responce?.hostInfo?.port ?? port ?? "Null"}\``,
                inline: true
            }, {
                name: client.Language.getText('resolverPlayers'),
                value: `${client.Language.getText('resolverPlayerInfo', { online: `${responce.players.online}`, max: `${responce.players.max}` })}`,
                inline: true
            }])
            .setFooter({
                iconURL: interaction.guild.iconURL(),
                text: `${interaction.guild.name} | EvilMC`
            })
            .setColor('Green');

        if (responce.favicon) {
            attachment = [new Discord.AttachmentBuilder(new Buffer.from(responce.favicon.split(',')[1], 'base64'), { name: "srvIcon.png" })]
            embed.setThumbnail("attachment://srvIcon.png");
        }

        await interaction.editReply({
            embeds: [embed],
            files: attachment,
            ephemeral: true
        })
    }
});