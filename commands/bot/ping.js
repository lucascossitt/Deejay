const Command = require('../../structures/Command')

module.exports = class Ping extends Command{
    constructor(client){
        super(client, {
            name: 'ping',
            args: false,
            usage: '',
            description: 'Latencia do bot',
            aliases: ['latencia'],
            enabled: true,
            inVoiceChannel: false,
            sameVoiceChannel: false,
            playing: false,
            ownerOnly: false
        })
    }
    async run(client, message, args){

        try {

            const msg = await message.quote(`Pingando...`)
            return msg.edit(`Latencia do bot: \`${msg.createdTimestamp - message.createdTimestamp}ms\`\nLatencia da API: \`${Math.round(client.ws.ping)}ms\``)
        
        } catch (error) {
            client.errorMessage(error, this, message)
        }
    }
}