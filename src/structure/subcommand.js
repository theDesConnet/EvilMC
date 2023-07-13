/**
 * EvilMC v2.0 (https://github.com/theDesConnet/EvilMC)
 * c0d9d by DesConnet
 */

const Discord = require('discord.js');
const Client = require('./client.js');

/**
 * 
 * @param {Client} client 
 * @param {Discord.CommandInteractionOptionResolver} args 
 * @param {Discord.CommandInteraction} interaction
 */
async function ExecuteFuctions(client, args, interaction) { }

//Класс команды
class SubCommand {
    /**
     * @typedef {{name: string, description: string, permissions: Discord.PermissionResolvable[], subCommandOptions: Discord.ApplicationCommandOption[] execute: ExecuteFuctions}} CommandOptions
     * @param {CommandOptions} options
     */
    constructor(options) {
        this.name = options.name;
        this.description = options.description;
        this.permissions = options.permissions;
        this.subCommandOptions = options.subCommandOptions; 
        this.execute = options.execute;
    }
}

module.exports = SubCommand;