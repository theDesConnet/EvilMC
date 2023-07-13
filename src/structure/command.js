/**
 * EvilMC v2.0 (https://github.com/theDesConnet/EvilMC)
 * c0d9d by DesConnet
 */

const Discord = require('discord.js');
const Client = require('./client.js');

/**
 * 
 * @param {Client} client 
 * @param {message.content.slice(config.prefix.length).trim().split(/ +/g)} args 
 * @param {Discord.CommandInteraction} interaction 
 */
async function ExecuteFuctions(client, args, interaction) { }

//Класс команды
class Command {
    /**
     * @typedef {{name: string, description: string, permissions: Discord.PermissionResolvable[], slashCommandOptions: Discord.ApplicationCommandOption[] execute: ExecuteFuctions}} CommandOptions
     * @param {CommandOptions} options
     */
    constructor(options) {
        this.name = options.name;
        this.description = options.description;
        this.permissions = options.permissions;
        this.slashCommandOptions = options.slashCommandOptions; 
        this.execute = options.execute;
    }
}

module.exports = Command;