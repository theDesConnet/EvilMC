/** @format */

const Command = require('../structure/command.js');
const Discord = require('discord.js');

module.exports = new Command({
    name: "about",
    description: "About bot",
    permissions: "SEND_MESSAGES",
    slashCommandOptions: [],
    async execute(client, args, interaction){
        let embed = new Discord.EmbedBuilder().setThumbnail(client.user.displayAvatarURL(dynamic = true)).setTitle("О боте").setDescription("Бот для проверки серверов Minecraft на устойчивость к различный методам краша\n\n**c0d9d by DesConnet**").setFooter({text: `Версия: ${client.version}`})
        interaction.reply({ embeds: [embed] });
    }
})
