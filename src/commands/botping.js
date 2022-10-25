/** @format */

const Command = require('../structure/command.js');
const Discord = require('discord.js');

module.exports = new Command({
    name: "ping",
    description: "Pong!",
    permissions: "SEND_MESSAGES",
    disableOnAttack: false,
    slashCommandOptions: [],
    async execute(client, args, interaction){
        let embed = new Discord.MessageEmbed()
        .setDescription(`:heart:Client Heartbeat: ${Date.now() - interaction.createdTimestamp}мс\n:satellite:Discord API response: ${client.ws.ping | 0 }мс`)
        .setColor('GREEN')
        .setFooter({
            text: `${interaction.guild.name} | EvilMC`,
            iconURL: client.user.avatarURL({dynamic: true})
        });

        interaction.reply({ embeds: [embed] });
    }
})
