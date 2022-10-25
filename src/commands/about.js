/** @format */

const Command = require('../structure/command.js');
const Discord = require('discord.js');

module.exports = new Command({
    name: "about",
    description: "About bot",
    permissions: "SEND_MESSAGES",
    slashCommandOptions: [],
    async execute(client, args, interaction){
        let embed = new Discord.MessageEmbed().setThumbnail(client.user.displayAvatarURL(dynamic = true)).setTitle("About Bot").setDescription("A bot to test Minecraft servers stability with various crash methods\n\n**c0d9d by DesConnet**").setFooter("Version: 1.1")
        interaction.reply({ embeds: [embed] });
    }
})
