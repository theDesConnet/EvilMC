/** @format */

const Command = require('../structure/command.js');
const Discord = require('discord.js');
var osu = require('node-os-utils')

module.exports = new Command({
    name: "hostusage",
    description: "Information about usage Host",
    permissions: "SEND_MESSAGES",
    slashCommandOptions: [],
    async execute(client, args, interaction){
        var cpu = osu.cpu
        var mem = osu.mem
        var memused = (await mem.used()).usedMemMb
        cpu.usage().then(cpuusage => {
            let embed = new Discord.EmbedBuilder().setThumbnail(client.user.displayAvatarURL(dynamic = true)).setTitle(client.language.getText("hostUsageTitle")).setDescription(`**${client.language.getText("hostUsageCPU")}:** ${cpuusage}%\n**${client.language.getText("hostUsageMem")}:** ${memused} mb`).setFooter({
                text: `${interaction.guild.name} | EvilMC`,
                iconURL: client.user.avatarURL({ dynamic: true })
            });

            interaction.reply({ embeds: [embed] });
        })
    }
})