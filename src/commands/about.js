const Command = require('../structure/command.js');
const Discord = require('discord.js');

module.exports = new Command({
    name: "about",
    description: "About bot!",
    slashCommandOptions: [],
    permissions: [Discord.PermissionFlagsBits.SendMessages],
    async execute(client, args, interaction) {
        interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setThumbnail(client.user.displayAvatarURL(dynamic = true))
                .setTitle(client.Language.getText("aboutBotTitle"))
                .setDescription(`${client.Language.getText("aboutBotDescription")}\n\n**c0d9d by DesConnet**`)
                .setFooter({ text: `${client.Language.getText("aboutBotVersion")}: ${client.version}` })
            ],
            components: [new Discord.ActionRowBuilder().addComponents([
                new Discord.ButtonBuilder()
                    .setLabel("GitHub Repository")
                    .setStyle(Discord.ButtonStyle.Link)
                    .setURL("https://github.com/theDesConnet/EvilMC")
            ])],
            ephemeral: true
        })
    }
});