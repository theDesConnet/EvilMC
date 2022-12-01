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
        let embed = new Discord.EmbedBuilder()
        .setDescription(`:heart:Сердцебиение клиента: ${Date.now() - interaction.createdTimestamp}мс\n:satellite:Ответ api Discord: ${client.ws.ping | 0 }мс`)
        .setColor('Green')
        .setFooter({
            text: `${interaction.guild.name} | EvilMC`,
            iconURL: client.user.avatarURL({dynamic: true})
        });

        interaction.reply({ embeds: [embed] });
    }
})
