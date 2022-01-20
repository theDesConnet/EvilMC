/** @format */

const Command = require('../structure/command.js');
const Discord = require('discord.js');
var osu = require('node-os-utils')

module.exports = new Command({
    name: "vpsusage",
    description: "инфо о vps",
    permissions: "SEND_MESSAGES",
    async execute(client, args, message){
        var cpu = osu.cpu
        var mem = osu.mem
        var memused = (await mem.used()).usedMemMb
        cpu.usage().then(cpuusage => {
            let embed = new Discord.MessageEmbed().setThumbnail(client.user.displayAvatarURL(dynamic = true)).setTitle("VPS Usage").setDescription(`**CPU Usage:** ${cpuusage}%\n**RAM Usage:** ${memused} mb`).setFooter("Hosted on AWS")
            message.reply({ embeds: [embed] });
        })
    }
})