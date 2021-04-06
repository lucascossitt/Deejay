const Event = require('../../structures/Event')
const chalk = require('chalk')
const createManager = require('../../player/createManager')
const Database = require('../../structures/Database')
const moment = require('moment')

module.exports = class Ready extends Event {
    constructor(...args){
        super(...args)
    }
    
    async run(){

        createManager(this.client)
        this.client.music.init(this.client.user.id)
        this.client.log(chalk.green.bold('[BOT] ') + chalk.white.bold('Iniciado.'))

        const config = await Database.Configs.findOne({_id: this.client.user.id})
        this.client.guilds.cache.forEach(async guild => {
            if(guild.id === '425864977996578816') return
            if(!config.guildsLiberadas.find(a => a.guildID === guild.id)){
                this.client.channels.cache.get(this.client.config.logsChannel).send(`Saindo da guild não liberada:\n\`\`\`Guild: ${guild.name}(${guild.id})\nData: ${moment(Date.now()).format('LLLL')}\`\`\``)
                await guild.leave()
            }
        })
    }
}