const Event = require('../../structures/Event')
const Database = require('../../structures/Database')
const moment = require('moment')

module.exports = class guildCreate extends Event{
    constructor(...args){
        super(...args)
    }

    async run(guild){
        const config = await Database.Guilds.findOne({_id: client.user.id})
        if(!config.guildsLiberadas.find(a => a.guildID === guild.id)){
            this.client.channels.cache.get(this.client.config.logsChannel).send(`Tentativa de adição do bot na guild não liberada:\n\`\`\`Guild: ${guild.name}(${guild.id})\nData: ${moment(Date.now()).format('LLLL')}\`\`\``)
            guild.leave()
        } else {
            this.client.channels.cache.get(this.client.config.logsChannel).send(`Bot adicionado na guild liberada:\n\`\`\`Guild: ${guild.name}(${guild.id})\nData: ${moment(Date.now()).format('LLLL')}\`\`\``)
        }
    }
}