const Event = require('../structure/event.js');
const config = require('../jsons/config.json');
const attacks = require('../jsons/attacks.json');
const fs = require('fs');


module.exports = new Event('ready', client => {
    console.clear()
    console.log('EvilMC v1.0\nc0d9d by DesConnet');
    client.user.setPresence({ activities: [{ name: `Crashing Minecraft Servers | EvilMC`, type: 'COMPETING' }]})
})