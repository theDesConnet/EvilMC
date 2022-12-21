/** @format */

const Command = require('../structure/command.js');
const Discord = require('discord.js');

module.exports = new Command({
    name: "about",
    description: "About bot",
    permissions: "SEND_MESSAGES",
    slashCommandOptions: [],
    async execute(client, args, interaction) {
        let embed = new Discord.EmbedBuilder().setThumbnail(client.user.displayAvatarURL(dynamic = true)).setTitle(client.language.getText("aboutBotTitle")).setDescription(`${client.language.getText("aboutBotDescription")}\n\n**c0d9d by DesConnet**`).setFooter({ text: `${client.language.getText("aboutBotVersion")}: ${client.version}` })
        const ghBtn = new Discord.ButtonBuilder()
            .setLabel("GitHub Repository")
            .setStyle(Discord.ButtonStyle.Link)
            .setURL("https://github.com/theDesConnet/EvilMC");

        interaction.reply({ embeds: [embed], components: [new Discord.ActionRowBuilder().addComponents([ghBtn])] });
    }
})
