/** format */

const Command = require('../structure/command.js');
const Discord = require('discord.js');
const config = require('../jsons/config.json');
const { exec } = require('child_process');
const attack = require('../jsons/attacks.json');

module.exports = new Command({
    name: "stop",
    description: "Эксплоит NullPing",
    permissions: "SEND_MESSAGES",
    async execute(client, args, message) {
        exec(`pkill 'java'`, (error, stdout, stderr) => {
            if (error) {
                console.log(`Ошибка: ${error}`);
                return;
            }
            if (stderr) {
                console.log(`StdErr: ${stderr}`);
                return;
            }
            console.log(`Была запущена атака: Stop`)
            console.log(`[Attack log] ${stdout}`);
        })

        attack.run = false;
        fs.writeFile('./jsons/attacks.json', JSON.stringify(attack), err => {
            if(err){
                 return errorembed("Ошибка записи в файл (Пожалйста обратитесь к DesConnet)")
            }
        })

        let runembed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`**Все атаки были остановлены** \n\n ☆ Made with ♥ by DesConnet ☆`)
            .setFooter(`${message.guild.name} | EvilMC`, client.user.avatarURL('jpg'))

        message.channel.send({ embeds: [runembed] });
    }
});