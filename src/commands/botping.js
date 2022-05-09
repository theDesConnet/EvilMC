/** @format */

const Command = require('../structure/command.js');
const Discord = require('discord.js');

module.exports = new Command({
    name: "ping",
    description: "Pong!",
    permissions: "SEND_MESSAGES",
    slashCommandOptions: [],
    async execute(client, args, interaction, crashers){
        let embed = new Discord.MessageEmbed()
        .setDescription(`:heart:Сердцебиение клиента: ${Date.now() - interaction.createdTimestamp}мс\n:satellite:Ответ api Discord: ${client.ws.ping | 0 }мс`)
        .setColor('GREEN')
        .setFooter({
            text: `${interaction.guild.name} | EvilMC`,
            iconURL: client.user.avatarURL({dynamic: true})
        });

        interaction.reply({ embeds: [embed] });
    }
})