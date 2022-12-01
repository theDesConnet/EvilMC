const Event = require('../structure/event.js');
const crashers = require('../functions/crashers.js');
const whitelist = require('../jsons/whitelist.json').whitelistid;
const config = require('../jsons/config.json');
const { InteractionType, ComponentType } = require('discord.js');

module.exports = new Event('interactionCreate', async (client, interaction) => {
    if (interaction.user.bot) return;

    switch (interaction.type) {
        case InteractionType.ApplicationCommand:
            const command = client.commands.find(cmd => cmd.name == interaction.commandName);
            const args = interaction.options;
            const unstop = args.getBoolean("unstopable") || false;
    
            if (!command) return;
    
            if (unstop && config.unstopableMode.enableUnstopableMode == false) return await crashers.errorembed(client, interaction, interaction.commandName, 'Режим атаки без остановки в данном боте отключен!', false);
    
            if (client.attacks.size >= config.countAttacks && command.disableOnAttack) return await crashers.errorembed(client, interaction, interaction.commandName, 'Превышено количество одновременных атак!', false);
    
            if (config.whitelistmode === true && !whitelist.includes(interaction.user.id)) return await crashers.errorembed(client, interaction, interaction.commandName, "Вы не находитесь в Вайтлисте!", false);
    
            command.execute(client, args, interaction);
            /**try {
                command.execute(client, args, interaction);
            } catch (err) {
                return crashers.errorembed(client, interaction, interaction.commandName, err.toString(), false);
            }**/
            break;

        case InteractionType.MessageComponent:
            if (interaction.componentType === ComponentType.Button) {
                const button = client.buttons.get(interaction.customId);

                if (!button) return;
                if (button.onlyAttackOwner && !interaction.memberPermissions.has("ADMINISTRATOR")) {
                    const Attack = client.attacks.find(x => x.msgID == interaction.message.id);
                    if (!Attack) return interaction.reply({content: "Данная атака уже не действительна", ephemeral: true});
                    if (Attack.ownerID != interaction.user.id) return interaction.reply({content: "Это не ваша атака", ephemeral: true});
                }
        
                return button.execute(client, interaction);
            }

            if (interaction.componentType === ComponentType.StringSelect) {
                const selectMenu = client.selectMenus.get(interaction.customId);

                if (!selectMenu) return;
                if (selectMenu.onlyAttackOwner && !interaction.memberPermissions.has("ADMINISTRATOR")) {
                    const Attack = client.attacks.find(x => x.msgID == interaction.message.id);
                    if (!Attack) return interaction.reply({content: "Данная атака уже не действительна", ephemeral: true});
                    if (Attack.ownerID != interaction.user.id) return interaction.reply({content: "Это не ваша атака", ephemeral: true});
                }
        
                return selectMenu.execute(client, interaction);
            }
            break;

        case InteractionType.ModalSubmit:
            const Modal = client.modals.get(interaction.customId);

            if (!Modal) return;
            if (Modal.onlyAttackOwner && !interaction.memberPermissions.has("ADMINISTRATOR")) {
                const Attack = client.attacks.find(x => x.msgID == interaction.message.id);
                if (!Attack) return interaction.reply({content: "Данная атака уже не действительна", ephemeral: true});
                if (Attack.ownerID != interaction.user.id) return interaction.reply({content: "Это не ваша атака", ephemeral: true});
            }
    
            return Modal.execute(client, interaction);
            break;
    }
});