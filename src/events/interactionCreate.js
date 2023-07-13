const Event = require('../structure/event.js');
const { InteractionType } = require('discord.js')

module.exports = new Event('interactionCreate', async (client, interaction) => {
    if (interaction.user.bot) return;

    switch (interaction.type) {
        case InteractionType.ApplicationCommand:
            const args = interaction.options;
            
            if (args.getSubcommand(false)) {
                const subcommand = client.subcommands.find(cmd => cmd.name == args.getSubcommand(false));   
                if (!subcommand) return;

                await subcommand.execute(client, args, interaction).catch(async (err) => {
                    await client.errorembed(client, interaction, err)
                });
            } else {
                const command = client.commands.find(cmd => cmd.name == interaction.commandName);
                if (!command) return;

                await command.execute(client, args, interaction).catch(async (err) => {
                    await client.errorembed(client, interaction, err)
                });
            }
            break;

        case InteractionType.MessageComponent:
            const component = client.components.get(interaction.customId);

            if (!component) return;
    
            await component.execute(client, interaction).catch(async (err) => {
                await client.errorembed(client, interaction, err)
            });
            break;

        case InteractionType.ModalSubmit:
            const Modal = client.modals.get(interaction.customId);

            if (!Modal) return;
    
            await Modal.execute(client, interaction).catch(async (err) => {
                await client.errorembed(client, interaction, err)
            });
            break;
    }
});