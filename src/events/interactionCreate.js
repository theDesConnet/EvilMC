const Event = require('../structure/event.js');
const crashers = require('../functions/crashers.js');
const whitelist = require('../jsons/whitelist.json').whitelistid;
const config = require('../jsons/config.json');

module.exports = new Event('interactionCreate', async (client, interaction) => {
    if (interaction.user.bot) return;

    if (interaction.isCommand()) { //Обработчик Slash команд 
        const command = client.commands.find(cmd => cmd.name == interaction.commandName);
        const args = interaction.options;
        const unstop = args.getBoolean("unstopable") || false;

        if (!command) return;

        if (unstop && config.unstopableMode.enableUnstopableMode == false) return crashers.errorembed(client, interaction, interaction.commandName, 'Non-stop attack mode is disabled in this bot!');

        if (client.attacks.size >= config.countAttacks && command.disableOnAttack) return crashers.errorembed(client, interaction, interaction.commandName, 'The number of simultaneous attacks is exceeded!');

        if (config.whitelistmode === true && !whitelist.includes(interaction.user.id)) return crashers.errorembed(client, interaction, interaction.commandName, "You are not on the Whitelist!");

        return command.execute(client, args, interaction);
    } 

    if (interaction.isButton()) { //Обработчик Кнопок 
        const button = client.buttons.get(interaction.customId);

        if (!button) return;
        if (button.onlyAttackOwner) {
            const Attack = client.attacks.find(x => x.msgID == interaction.message.id);
            if (!Attack) return interaction.reply({content: "The attack is no longer valid", ephemeral: true});
            if (Attack.ownerID != interaction.user.id) return interaction.reply({content: "This is not your attack", ephemeral: true});
        }

        return button.execute(client, interaction);
    }

    if (interaction.isSelectMenu()) { //Обработчик selectMenu
        const selectMenu = client.selectMenus.get(interaction.customId);

        if (!selectMenu) return;
        if (selectMenu.onlyAttackOwner) {
            const Attack = client.attacks.find(x => x.msgID == interaction.message.id);
            if (!Attack) return interaction.reply({content: "The attack is no longer valid", ephemeral: true});
            if (Attack.ownerID != interaction.user.id) return interaction.reply({content: "This is not your attack", ephemeral: true});
        }

        return selectMenu.execute(client, interaction);
    }

    if (interaction.isModalSubmit()) {
        const Modal = client.modals.get(interaction.customId);

        if (!Modal) return;
        if (Modal.onlyAttackOwner) {
            const Attack = client.attacks.find(x => x.msgID == interaction.message.id);
            if (!Attack) return interaction.reply({content: "The attack is no longer valid", ephemeral: true});
            if (Attack.ownerID != interaction.user.id) return interaction.reply({content: "This is not your attack", ephemeral: true});
        }

        return Modal.execute(client, interaction);
    }
});
