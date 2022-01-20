const Event = require('../structure/event.js');
const config = require('../jsons/config.json');
const attack = require('../jsons/attacks.json');
const fs = require('fs');


module.exports = new Event('ready', client => {
    attack.run = false;
    fs.writeFile('./jsons/attacks.json', JSON.stringify(attack), err => {
        if(err){
            console.log(err)
        }
    })
    console.clear()
    console.log('EvilMC v1.0\nc0d9d by DesConnet');
})
