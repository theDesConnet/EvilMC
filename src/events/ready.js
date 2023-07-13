const Event = require('../structure/event.js');
const Discord = require('discord.js');

module.exports = new Event('ready', client => {
    console.clear();
    console.log(`[INFO] EvilMC Started v${client.version} | c0d9d by DesConnet (https://ds1nc.ru)`);
    client.user.setPresence({ activities: [{ name: `Crashing Minecraft Servers | EvilMC`, type: Discord.ActivityType.Competing }]})
})