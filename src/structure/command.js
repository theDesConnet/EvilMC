const Discord = require('discord.js');
const Client = require('./client.js');

/**
 * 
 * @param {Client} client 
 * @param {message.content.slice(config.prefix.length).trim().split(/ +/g)} args 
 * @param {Discord.Message} message 
 */
function ExecuteFuctions(client, args, message) { }

class Command {
    /**
     * @typedef {{name: string, description: string, permissions: Discord.PermissionString, execute: ExecuteFuctions}} CommandOptions
     * @param {CommandOptions} options
     */
    constructor(options) {
        this.name = options.name;
        this.description = options.description;
        this.permissions = options.permissions;
        this.execute = options.execute;
    }
}

module.exports = Command;