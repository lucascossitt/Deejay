const Event = require('../../structures/Event')
const chalk = require('chalk')
const createManager = require('../../player/createManager')

module.exports = class Ready extends Event {
    constructor(...args){
        super(...args)
    }
    
    async run(){

        createManager(this.client)
        this.client.music.init(this.client.user.id)
        this.client.log(chalk.green.bold('[BOT] ') + chalk.white.bold('Iniciado.'))
    }
}