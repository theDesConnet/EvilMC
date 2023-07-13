const Command = require('../structure/command.js');
const Discord = require('discord.js');
const cfg = require("../jsons/config.json");

module.exports = new Command({
    name: "restart",
    description: "Restart bot (for Bot owner ONLY) [Required Cluster Autorestart]",
    slashCommandOptions: [],
    permissions: [Discord.PermissionFlagsBits.Administrator],
    async execute(client, args, interaction) {
        if (interaction.user.id != cfg.General.ownerID) return client.errorembed(client, interaction, client.Language.getText("notPermissionsError"));
        await interaction.reply({content: client.Language.getText("restartDone"), ephemeral: true});
        process.exit(0);
    }
});