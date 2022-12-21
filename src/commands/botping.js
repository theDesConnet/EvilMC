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
        .setDescription(`:heart:${client.language.getText("clientPing")}: ${Date.now() - interaction.createdTimestamp}${client.language.getText("msPing")}\n:satellite:${client.language.getText("discordAPIPing")}: ${client.ws.ping | 0 }${client.language.getText("msPing")}`)
        .setColor('Green')
        .setFooter({
            text: `${interaction.guild.name} | EvilMC`,
            iconURL: client.user.avatarURL({dynamic: true})
        });

        interaction.reply({ embeds: [embed] });
    }
})