/**
 * EvilMC v2.0 (https://github.com/theDesConnet/EvilMC)
 * c0d9d by DesConnet
 */

//Отдел констант
const Discord = require('discord.js');
const Command = require('./command.js');
const Event = require('./event.js');
const config = require('../jsons/config.json');
const Modal = require('./modal.js');
const Component = require('./component.js');
const Subcommand = require('./subcommand.js');
const Language = require('./language.js');
const { MineInfo } = require('mineinfo-old');
const Attack = require('./attack.js');
const { ErrorEmbed } = require('../libs/dhelper.js');

const fs = require('fs');
//Отдел констант

//Класс клиента
class Client extends Discord.Client {
    constructor() {
        super({
            intents: [
                Discord.GatewayIntentBits.Guilds,
                Discord.GatewayIntentBits.GuildMessages,
                Discord.GatewayIntentBits.GuildVoiceStates,
                Discord.GatewayIntentBits.MessageContent
            ], partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER']
        })


        this.version = require('../package.json').version;
        /**
         * @type {ErrorEmbed}
         */
        this.errorembed = ErrorEmbed;
        /**
         * @type {Discord.Collection<string, Command>}
         */
        this.commands = new Discord.Collection();
        /**
         * @type {Discord.Collection<string, Subcommand>}
         */
        this.subcommands = new Discord.Collection();
        /**
         * @type {MineInfo}
         */
        this.mineping = new MineInfo(false);
        /**
         * @type {Discord.Collection<string, Attack>}
         */
        this.attacks = new Discord.Collection();
        /**
         * @type {Language}
         */
        this.Language = new Language({
            languageFile: require(`../languages/${config.General.languageFileName.endsWith(".json") ? config.General.languageFileName : `${config.General.languageFileName}.json`}`)
        })
        /**
         * @type {Discord.Collection<string, Component>}
         */
        this.components = new Discord.Collection();
        /**
         * @type {Discord.Collection<string, Modal>}
         */
        this.modals = new Discord.Collection();
        /**
         * @type {number}
         */
        this.allThreads = 0;
    }

    async RunBot(token) {
        //Обработчик команд
        const commandFiles = fs.readdirSync('./commands/')
            .filter(file => file.endsWith('.js'))
            .filter(file => !file.startsWith("_"));
        /**
         * @type {Command[]}
         */

        const commands = commandFiles.map(file => require(`../commands/${file}`));

        commands.forEach(cmd => {
            console.log(`[INFO] ${this.Language.getText('addCommand', { cmdname: cmd.name })}`);
            this.commands.set(cmd.name, cmd);
        })

        const slashCommands = commands
            .map(cmd => {
                let slashSubCommands;
                if (typeof (cmd.execute) == "undefined" && typeof (cmd.slashCommandOptions) == "undefined") {
                    fs.readdirSync("./subcommands/")
                        .forEach(folder => {
                            if (folder == cmd.name) {
                                const subcommands = fs.readdirSync(`./subcommands/${folder}/`)
                                    .filter(file => file.endsWith('.js'))
                                    .filter(file => !file.startsWith("_"))
                                    .map((subcommand) => {
                                        /**
                                         * @type {Subcommand}
                                         */
                                        const scommand = require(`../subcommands/${folder}/${subcommand}`);
                                        this.subcommands.set(`${cmd.name}.${scommand.name}`, scommand);
                                        console.log(`[INFO] ${this.Language.getText('loadedSubcommand', { cmdname: cmd.name, scmdname: scommand.name })}`);
                                        return {
                                            name: scommand.name,
                                            type: Discord.ApplicationCommandOptionType.Subcommand,
                                            description: scommand.description,
                                            options: scommand.subCommandOptions
                                        }
                                    })

                                slashSubCommands = subcommands;
                            }
                        })
                }

                return {
                    name: cmd.name,
                    description: cmd.description,
                    defaultMemberPermissions: cmd.permissions,
                    options: slashSubCommands ?? cmd.slashCommandOptions,
                    defaultPermission: true
                }
            })

        this.removeAllListeners();
        this.on("ready", async () => {
            const command = await this.application.commands.set(slashCommands);

            command.forEach((cmd) => {
                console.log(`[INFO] ${this.Language.getText('loadedSlashCommand', { slashCmd: cmd.name })}`);
            })
        })

        //Обработчик ивентов
        fs.readdirSync('./events/')
            .filter(file => file.endsWith('.js'))
            .filter(file => !file.startsWith("_"))
            .forEach(file => {
                /**
                 * @type {Event}
                 */
                const event = require(`../events/${file}`)
                console.log(`[INFO] ${this.Language.getText('loadedEvent', { event: event.event })}`)
                this.on(event.event, event.run.bind(null, this))
            })

        //Обработчик компонентов
        fs.readdirSync('./components/').forEach(typeFolder => {
            fs.readdirSync(`./components/${typeFolder}/`)
                .filter(file => file.endsWith('.js'))
                .filter(file => !file.startsWith("_"))
                .forEach((component) => {
                    const cmp = require(`../components/${typeFolder}/${component}`);
                    this.components.set(cmp.componentID, cmp);

                    switch (cmp.componentType) {
                        case Discord.ComponentType.Button:
                            console.log(`[INFO] ${this.Language.getText('loadedButtonComponent', { btnID: cmp.componentID })}`);
                            break;

                        case Discord.ComponentType.ChannelSelect:
                        case Discord.ComponentType.MentionableSelect:
                        case Discord.ComponentType.RoleSelect:
                        case Discord.ComponentType.StringSelect:
                        case Discord.ComponentType.UserSelect:
                            console.log(`[INFO] ${this.Language.getText('loadedSelectMenuComponent', { selMenu: cmp.componentID })}`);
                            break;
                    }
                })
        })

        //Обработчик модальных окон
        fs.readdirSync('./modals/')
            .filter(file => file.endsWith('.js'))
            .filter(file => !file.startsWith("_"))
            .forEach((modal) => {
                const md = require(`../modals/${modal}`);
                this.modals.set(md.modalID, md);
                console.log(`[INFO] ${this.Language.getText('loadedModalComponent', { modal: md.modalID })}`);
            })

        //Логин бота
        this.login(token).catch(err => {
            if (err == "Error [TokenInvalid]: An invalid token was provided.") {
                return console.log(this.Language.getText('tokenInvalidError'))
            }
            return console.log(err)
        })
    }
}

module.exports = Client;