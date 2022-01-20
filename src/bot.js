/**
 * EvilMC v1.0 (c0d9d by DesConnet)
 */

console.clear();

const Client = require('./structure/client.js');
const config = require('./jsons/config.json');

const client = new Client();

client.RunBot(config.token);