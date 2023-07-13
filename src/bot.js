/**
 * EvilMC v2.0 (https://github.com/theDesConnet/EvilMC)
 * c0d9d by DesConnet
 */

const cluster = require('cluster');
const config = require('./jsons/config.json');

if (config.General.autoRestartWithCluster && cluster.isPrimary) {
    console.clear();
    console.log(`[INFO] AutoRestart system on Cluster enabled\n[INFO] Primary process pid: ${process.pid}`);
    console.log(`[INFO] Worker with pid: ${cluster.fork().process.pid} has been started.`);
    cluster.on('exit', (worker, code, signal) => {
        console.clear();
        console.log(`[INFO] Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    (async () => {
        const Client = require('./structure/client.js');
    
        const client = new Client();
        await client.RunBot(config.General.token);
    })();
}