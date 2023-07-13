const Command = require('../structure/command.js');
const Discord = require('discord.js');

module.exports = new Command({
    name: "ping",
    description: "Pong!",
    slashCommandOptions: [],
    permissions: [Discord.PermissionFlagsBits.SendMessages],
    async execute(client, args, interaction) {
        interaction.reply({embeds: [new Discord.EmbedBuilder()
            .setDescription(`:heart:${client.Language.getText("clientPing")}: ${Date.now() - interaction.createdTimestamp}${client.Language.getText("msPing")}\n:satellite:${client.Language.getText("discordAPIPing")}: ${client.ws.ping | 0 }${client.Language.getText("msPing")}`)
            .setColor('Green')
            .setFooter({
                text: `${interaction.guild.name} | EvilMC`,
                iconURL: client.user.avatarURL({dynamic: true})
            })], 
            ephemeral: true
        })
    }
});