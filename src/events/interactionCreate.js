const Event = require('../structure/event.js');
const crashers = require('../functions/crashers.js');
const attack = require('../jsons/attacks.json');
const whitelist = require('../jsons/whitelist.json').whitelistid;
const config = require('../jsons/config.json');

module.exports = new Event('interactionCreate', async (client, interaction) => {
    if (interaction.user.bot) return;

    if (interaction.isCommand()) { //Обработчик Slash команд 
        const command = client.commands.find(cmd => cmd.name == interaction.commandName);
        const args = interaction.options;

        if (!command) return;

        if (attack.run === true) return crashers.errorembed(client, interaction, interaction.commandName, 'В данный момент уже запущена атака, пожалуйста подождите пока атака завершится');

        if (config.whitelistmode === true && !whitelist.includes(interaction.user.id)) return crashers.errorembed(client, interaction, interaction.commandName, "Вы не находитесь в Вайтлисте!");

        command.execute(client, args, interaction, crashers);
    } 
});