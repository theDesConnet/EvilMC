const Command = require('../structure/command.js');
const Discord = require('discord.js');
const osu = require('node-os-utils')

module.exports = new Command({
    name: "hostusage",
    description: "Information about usage Host",
    permissions: [Discord.PermissionFlagsBits.SendMessages],
    slashCommandOptions: [],
    async execute(client, args, interaction){
        osu.cpu.usage().then(async (cpuusage) => {
            let embed = new Discord.EmbedBuilder()
            .setThumbnail(client.user.displayAvatarURL(dynamic = true))
            .setTitle(client.Language.getText("hostUsageTitle"))
            .setDescription(`**${client.Language.getText("hostUsageCPU")}:** ${cpuusage}%\n**${client.Language.getText("hostUsageMem")}:** ${(await osu.mem.used()).usedMemMb} mb`).setFooter({
                text: `${interaction.guild.name} | EvilMC`,
                iconURL: client.user.avatarURL({ dynamic: true })
            });

            await interaction.reply({ embeds: [embed] });
        })
    }
})