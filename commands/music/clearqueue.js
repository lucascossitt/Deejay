const Command = require('../../structures/Command')

module.exports = class ClearQueue extends Command{
    constructor(client){
        super(client, {
            name: 'clearqueue',
            args: false,
            usage: '',
            description: 'Limpar fila',
            aliases: [],
            enabled: true,
            inVoiceChannel: true,
            sameVoiceChannel: true,
            playing: true,
            ownerOnly: false
        })
    }

    async run(client, message, args){

        try {
            
            const player = message.guild.player
            if(!message.member.roles.cache.get(message.guildDb.djRole) && !message.author.id === client.config.owner && message.author.id !== player.queue.current.requester.id && message.guild.channels.cache.get(player.voiceChannel).members.filter(a => !a.user.bot).size > 1) return message.quote(`Somente DJ's e quem colocou a musica podem limpar a fila.`)

            player.queue.clear()
            message.quote('Fila limpa.')

        } catch (error) {
            client.errorMessage(error, this, message)
        }
    }
}