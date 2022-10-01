//Файл функций для крашеров
const Discord = require('discord.js');
const Client = require('../structure/client.js');

module.exports = {
    /**
     * @param {Client} client
     * @param {Discord.CommandInteraction} interaction 
     * @param {string} text 
     */
    errorembed(client, interaction, cmdname, text) {
        const command = client.commands.find(cmd => cmd.name == cmdname)
        let errembed = new Discord.MessageEmbed()
            .setColor('RED')
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            })
            .addField("Команда:", `/${command.name}`, false)
            .addField("Причина:", `${text}`, false)
            .setFooter({
                text: `${interaction.guild.name} | EvilMC`,
                iconURL: client.user.avatarURL({dynamic: true})
            });
        interaction.reply({ embeds: [errembed] })
    }
}