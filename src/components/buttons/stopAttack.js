const Button = require('../../structure/button.js');


module.exports = new Button({
    buttonID: "stopAttack",
    onlyAttackOwner: true,
    async execute(client, interaction) {
        const attack = client.attacks.find((x) => x.msgID == interaction.message.id);
        if (!attack) return interaction.reply({content: client.language.getText("inactiveAttackError"), ephemeral: true});
        await attack.stopAttack();
    }
});