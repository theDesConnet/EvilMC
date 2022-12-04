//Файл функций для крашеров
const Discord = require('discord.js');
const Client = require('../structure/client.js');
const util = require('minecraft-server-util');

module.exports = {
    /**
     * @param {Client} client
     * @param {Discord.CommandInteraction} interaction 
     * @param {string} text 
     */
    async errorembed(client, interaction, cmdname, text, replied) {
        const command = client.commands.find(cmd => cmd.name == cmdname)
        let errembed = new Discord.EmbedBuilder()
            .setColor('Red')
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            })
            .addFields([{
                name: "Команда:",
                value: `/${command.name}`,
                inline: false
            }, {
                name: "Причина:",
                value: `${text}`,
                inline: false
            }])
            .setFooter({
                text: `${interaction.guild.name} | EvilMC`,
                iconURL: client.user.avatarURL({dynamic: true})
            });

        if (replied) await interaction.editReply({ embeds: [errembed] })
        else await interaction.reply({ embeds: [errembed] })
    },

    async autoResolver(host) {
        const responce = await util.status(host)

        if (!responce.srvRecord) return { host: host, port: 25565 }
        else return { host: responce.srvRecord.host, port: responce.srvRecord.port } 
    }
}