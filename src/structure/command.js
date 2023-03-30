const Discord = require('discord.js');
const Client = require('./client.js');

/**
 * 
 * @param {Client} client 
 * @param {Discord.CommandInteractionOption} args 
 * @param {Discord.CommandInteraction} interaction
 */
async function ExecuteFunctions(client, args, interaction) { }

class Command {
    /**
     * @typedef {{name: string, description: string, permissions: Discord.PermissionString, disableOnAttack: Boolean, slashCommandOptions: Discord.ApplicationCommandOption[] execute: ExecuteFunctions}} CommandOptions
     * @param {CommandOptions} options
     */
    constructor(options) {
        this.name = options.name;
        this.description = options.description;
        this.permissions = options.permissions;
        this.disableOnAttack = options.disableOnAttack;
        this.slashCommandOptions = options.slashCommandOptions;
        this.execute = options.execute;
    }
}

module.exports = Command;