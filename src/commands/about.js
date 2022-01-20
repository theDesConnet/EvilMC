/** @format */

const Command = require('../structure/command.js');
const Discord = require('discord.js');

module.exports = new Command({
    name: "about",
    description: "инфо о боте",
    permissions: "SEND_MESSAGES",
    async execute(client, args, message){
        let embed = new Discord.MessageEmbed().setThumbnail(client.user.displayAvatarURL(dynamic = true)).setTitle("О боте").setDescription("Бот для проверки серверов Minecraft на устойчивость к различный методам краша\n**c0d9d by DesConnet**").setFooter("Версия: 1.0 Beta")
        message.reply({ embeds: [embed] });
    }
})
