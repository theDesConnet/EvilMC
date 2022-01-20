/** format */

const Command = require('../structure/command.js');
const Discord = require('discord.js');
const https = require('https');
const fs = require('fs');
const moment = require('moment');

module.exports = new Command({
    name: "updateproxies",
    description: "Обновляем прокси",
    permissions: "SEND_MESSAGES",
    async execute(client, args, message){
        var url = "https://api.openproxylist.xyz/socks4.txt"
        const file = fs.createWriteStream("./jars/socks_proxies.txt")
        fs.writeFileSync('./jars/socks_proxies.txt', ' ');
        const request = https.get(url, function(response) {
            response.pipe(file)
            console.log(`[${moment.utc(Date.now())}] [*] Прокси успешно обновлены`)
        });
        const embed = new Discord.MessageEmbed()
        .setTitle("Успех!")
        .setDescription(`Прокси были успешно обновлены!`)
        .setFooter(`${message.guild.name} | EvilMC`, client.user.avatarURL([format='jpg']))
        message.channel.send({embeds: [embed]})
    }
})
