/** format */

const Command = require('../structure/command.js');
const Discord = require('discord.js');
const https = require('https');
const fs = require('fs');
const moment = require('moment');

module.exports = new Command({
    name: "updateproxies",
    description: "Update proxy",
    permissions: "SEND_MESSAGES",
    disableOnAttack: true,
    slashCommandOptions: [],
    async execute(client, args, interaction){
        var url = "https://api.openproxylist.xyz/socks4.txt"
        const file = fs.createWriteStream("./jars/socks_proxies.txt")
        fs.writeFileSync('./jars/socks_proxies.txt', ' ');
        const request = https.get(url, function(response) {
            response.pipe(file)
            console.log(`[${moment.utc(Date.now())}] [*] Proxies successfully updated`)
        });
        const embed = new Discord.MessageEmbed()
        .setTitle("Успех!")
        .setDescription(`Proxies have been successfully updated!`)
        .setFooter(`${message.guild.name} | EvilMC`, client.user.displayAvatarURL(dynamic = true))
        interaction.reply({embeds: [embed]})
    }
})
