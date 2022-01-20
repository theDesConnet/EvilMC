/** @format */

const Command = require('../structure/command.js');
const Discord = require('discord.js');

module.exports = new Command({
    name: "botping",
    description: "Проверям связь с ботом test",
    permissions: "SEND_MESSAGES",
    async execute(client, args, message){
        let embed = new Discord.MessageEmbed()
        .setDescription(`:heart:Сердцебиение клиента: ${Date.now() - message.createdTimestamp}мс\n:satellite:Ответ api Discord: ${client.ws.ping | 0 }мс`)
        .setColor('GREEN')
        .setFooter(`${message.guild.name} | EvilMC`, client.user.avatarURL([format='jpg']))
        message.reply({ embeds: [embed] });
    }
})