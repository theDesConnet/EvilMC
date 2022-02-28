/** format */

const Command = require('../structure/command.js');
const Discord = require('discord.js');

module.exports = new Command({
    name: "help",
    description: "Помощь",
    permissions: "SEND_MESSAGES",
    async execute(client, args, message) {
        function list() {
            return `${client.commands.map(cmd => `\`${cmd.name}\``).join(", ")}`;
        }


        let embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`Список команд`)
            .setDescription(`${list()}`)
            .setThumbnail(client.user.avatarURL('jpg'))
            .setFooter(`Всего команд: ${client.commands.size} | EvilMC`, client.user.avatarURL('jpg'));

        message.channel.send({embeds: [embed]})
    }
});