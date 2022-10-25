const Button = require('../../structure/button.js');


module.exports = new Button({
    buttonID: "stopAttack",
    onlyAttackOwner: true,
    async execute(client, interaction) {
        const attack = client.attacks.find((x) => x.msgID == interaction.message.id);
        if (!attack) return interaction.reply({content: "This attack is no longer valid", ephemeral: true});
        attack.stopAttack();
    }
});
