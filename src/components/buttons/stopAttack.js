const Component = require('../../structure/component.js');
const Discord = require('discord.js');
const cfg = require('../../jsons/config.json');

module.exports = new Component({
    componentID: "stopAttack",
    componentType: Discord.ComponentType.Button,
    async execute(client, interaction) {
        const attack = client.attacks.find(x => x.message.id == interaction.message.id);

        if(!attack) return await client.errorembed(client, interaction, client.Language.getText("inactiveAttackError"));
        if (cfg.Features.unstopableMode.settings.stopAttackOnlyOwnerAttack && 
            !interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && 
            attack.ownerID != interaction.user.id) return client.errorembed(client, interaction, client.Language.getText("notOwnerAttackError"))

        await attack.stopAttack();
    }
});