/**
 * Некоторые вспомогательные приколюхи (by DesConnet)
 */

const Discord = require('discord.js');
const Client = require('../structure/client');
const config = require('../jsons/config.json');

module.exports = {
    delay: ms => new Promise(resolve => setTimeout(resolve, ms)),

    /**
     * @param {Client} client
     * @param {Discord.CommandInteraction} interaction 
     * @param {string} text 
     */
    async ErrorEmbed(client, interaction, text = "Unexpected error...", ephemeral = config.General.defaultEphemeralError) {
        let errembed = new Discord.EmbedBuilder()
            .setColor('Red')
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            })
            .addFields([{
                name: interaction.customId ? "Component:" : "Command:",
                value: interaction.customId ?? `/${interaction.commandName}`,
                inline: false
            }, {
                name: "Reason:",
                value: `${text}`,
                inline: false
            }])
            .setFooter({
                text: `${interaction?.guild?.name ?? client.user.username}`,
                iconURL: client.user.displayAvatarURL({ dynamic: true })
            });

        if (interaction.replied || interaction.deferred) await interaction.editReply({ embeds: [errembed] })
        else {
            try {
                await interaction.reply({ embeds: [errembed], ephemeral })
            } catch (err) { await interaction.channel.send({ embeds: [errembed], ephemeral }) }
        }
    }
}