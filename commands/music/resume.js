const Command = require('../../structures/Command')

module.exports = class Resume extends Command{
    constructor(client){
        super(client, {
            name: 'resume',
            args: false,
            usage: '',
            description: 'Resumir a musica',
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
            if(!message.member.roles.cache.get(message.guildDb.djRole) && !message.author.id === client.config.owner && message.author.id !== player.queue.current.requester.id && message.guild.channels.cache.get(player.voiceChannel).members.filter(a => !a.user.bot).size > 1) return message.quote(`Somente DJ's e quem colocou a musica podem resumir.`)

            if(!player.paused) return message.quote('A musica não esta pausada.')
            if(message.member.roles.cache.get(message.guildDb.djRole) || message.author.id === client.config.owner){
              player.pause(false)
              message.quote('Musica resumida.')
            } else {
              player.pause(false)
              message.quote('Musica resumida.')
              clearTimeout(player.pauseTimeout)
              delete player.pauseTimeout
            }

        } catch (error) {
            client.errorMessage(error, this, message)
        }
    }
}