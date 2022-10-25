const Discord = require('discord.js');
const Command = require('./command.js');
const Event = require('./event.js');
const Attack = require('./attack.js');
const Button = require('./button.js');
const selectMenu = require('./selectMenu.js');
const Modal = require('./modal.js');

const intents = new Discord.Intents(32767);

const fs = require('fs');

//Класс клиента
class Client extends Discord.Client {
    constructor() {
        super({ intents })

        /**
         * @type {Discord.Collection<string, Command>}
         */
        this.commands = new Discord.Collection()

        /**
         * @type {Discord.Collection<string, Attack>}
         */
        this.attacks = new Discord.Collection()

        /**
         * @type {Discord.Collection<string, Button>}
         */
        this.buttons = new Discord.Collection();

        /**
         * @type {Discord.Collection<string, selectMenu>}
         */
        this.selectMenus = new Discord.Collection();

        /**
         * @type {Discord.Collection<string, Modal>}
         */
        this.modals = new Discord.Collection();
    }

    RunBot(token) {
        //Обработчик команд
        const commandFiles = fs.readdirSync('./commands/')
            .filter(file => file.endsWith('.js'))
            .filter(file => !file.startsWith("_"));

        /**
         * @type {Command[]}
         */

        const commands = commandFiles.map(file => require(`../commands/${file}`));

        commands.forEach(cmd => {
            this.commands.set(cmd.name, cmd);
        })

        const slashCommands = commands.map(cmd => ({
            name: cmd.name,
            description: cmd.description,
            permissions: [],
            options: cmd.slashCommandOptions,
            defaultPermission: true
        }));

        //Обработчик компонентов
        fs.readdirSync('./components/').forEach(component => {
            const components = fs.readdirSync(`./components/${component}/`)
                .filter(file => file.endsWith('.js'))
                .filter(file => !file.startsWith("_"));

            switch (component) {
                case "buttons":
                    components.forEach((button) => {
                        const btn = require(`../components/buttons/${button}`)
                        this.buttons.set(btn.buttonID, btn);
                        console.log(`[INFO] Component (Button) with ID "${btn.buttonID}" was successfully loaded`);
                    })
                    break;

                case "selectMenus":
                    components.forEach((SelectMenu) => {
                        const selMenu = require(`../components/selectMenus/${SelectMenu}`)
                        this.selectMenus.set(selMenu.selectMenuID, selMenu);
                        console.log(`[INFO] Component (selectMenu) with ID "${selMenu.selectMenuID}" was successfully loaded`);
                    })
                    break;

                case "modals":
                    components.forEach((modal) => {
                        const modalInteraction = require(`../components/modals/${modal}`)
                        this.modals.set(modalInteraction.modalID, modalInteraction);
                        console.log(`[INFO] Component (Modals) with ID "${modalInteraction.modalID}" was successfully loaded`);
                    })
                    break;
            }
        })

        this.removeAllListeners();
        this.on("ready", async () => {
            const command = await this.application.commands.set(slashCommands);

            command.forEach((cmd) => {
                console.log(`[INFO] Slash command "${cmd.name} has been loaded"`);
            })
        })

        fs.readdirSync('./events/')
            .filter(file => file.endsWith('.js'))
            .forEach(file => {
                /**
                 * @type {Event}
                 */
                const event = require(`../events/${file}`)
                console.log(`Ивент: ${event.event} был загружен`)
                this.on(event.event, event.run.bind(null, this))
            })

        //Логин бота
        this.login(token).catch(err => {
            if (err == "Error [TOKEN_INVALID]: An invalid token was provided.") {
                return console.log("Error:\nToken is invalid or missing\n\nEvilMC\nc0d9d by DesConnet");
            }
            return console.log(err)
        })
    }
}

module.exports = Client;
