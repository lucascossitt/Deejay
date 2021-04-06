const Command = require('../../structures/Command')

module.exports = class Pause extends Command{
    constructor(client){
        super(client, {
            name: 'pause',
            args: false,
            usage: '',
            description: 'Pausar uma musica',
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
            if(!message.member.roles.cache.get(message.guildDb.djRole) && !message.author.id === client.config.owner && message.author.id !== player.queue.current.requester.id && message.guild.channels.cache.get(player.voiceChannel).members.filter(a => !a.user.bot).size > 1) return message.quote(`Somente DJ's e quem colocou a musica podem pausar a musica.`)

            if(player.paused) return message.quote('A musica ja esta pausada.')
            if(message.member.roles.cache.get(message.guildDb.djRole) || message.author.id === client.config.owner){
              player.pause(true)
              message.quote('Musica pausada.')
            } else {
              player.pause(true)
              player.pauseTimeout = setTimeout(() => {
                player.pause(false)
                message.quote('Musica resumida automaticamente.')
              }, 60000)
              message.quote('Musica pausada. (OBS: Você não é DJ, portanto a musica sera resumida em 1 minuto caso você não resuma ela antes!)')
            }

        } catch (error) {
            client.errorMessage(error, this, message)
        }
    }
}