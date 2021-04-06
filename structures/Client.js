const Discord = require('discord.js')
const chalk = require('chalk')
const moment = require('moment')

module.exports = class Client extends Discord.Client {
    constructor() {
        super({
            fetchAllMembers: true,
            ws: { intents: Discord.Intents.ALL }
        })

        this.commands = new Discord.Collection()
        this.aliases = new Discord.Collection()
        this.cmdUsado = 1

        this.config = require('../config.js')
    }
    
    log(msg) {
        console.log(chalk.white.bold(`[${new Date().toLocaleString()}]`) + chalk.white.bold(' > ') + msg);
    }

    errorMessage(err, cmd, message){
        this.channels.cache.get(this.config.errorChannel).send(`Erro no comando \`${cmd.name}\`\nGuild: \`${message.guild.name}(${message.guild.id})\`\nAutor: \`${message.author.tag}(${message.author.id})\`\nData: \`${moment(Date.now()).format('LLLL')}\`\n` + '```JS\n' + err.stack + '```')
        return message.quote('Houve um problema ao executar este comando. Fique tranquilo, o erro ja foi enviado automaticamente para o desenvolvedor.')
    }

    transformarTempo(millisec){
        var seconds = (millisec / 1000).toFixed(0);
        var minutes = Math.floor(seconds / 60);
        var hours = "";
        if (minutes > 59) {
          hours = Math.floor(minutes / 60);
          hours = (hours >= 10) ? hours : "0" + hours;
          minutes = minutes - (hours * 60);
          minutes = (minutes >= 10) ? minutes : "0" + minutes;
        }
        seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        if (hours != "") {
          return hours + ":" + minutes + ":" + seconds;
        }
        return minutes + ":" + seconds;
    }
    
    async login(token = this.token) {
        super.login(token);
    }
}