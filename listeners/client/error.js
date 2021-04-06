const Event = require('../../structures/Event')

module.exports = class Error extends Event{
    constructor(...args){
        super(...args)
    }

    async run(error){
        this.client.channels.cache.get('784121542408667136').send(`Erro no bot \n` + '```JS\n' + error.stack + '```')
    }
}