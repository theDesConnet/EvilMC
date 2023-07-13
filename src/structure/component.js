/**
 * EvilMC v2.0 (https://github.com/theDesConnet/EvilMC)
 * c0d9d by DesConnet
 */

const Discord = require('discord.js');
const Client = require('./client.js');

/**
 * 
 * @param {Client} client 
 * @param {Discord.ButtonInteraction | Discord.ModalSubmitInteraction | Discord.AutocompleteInteraction} interaction
 */
async function ExecuteFuctions(client, interaction) { }

//Класс компонента
class Component {
    /**
     * @typedef {{componentID: string, componentType: Discord.ComponentType, execute: ExecuteFuctions}} ComponentOptions
     * @param {ComponentOptions} options
     */
    constructor(options) {
        this.componentID = options.componentID;
        this.componentType = options.componentType;
        this.execute = options.execute;
    }
}

module.exports = Component;