const Command = require('../../structures/Command')

module.exports = class Volume extends Command{
    constructor(client){
        super(client, {
            name: 'volume',
            args: false,
            usage: '(1-100)',
            description: 'Mudar volume',
            aliases: ['vol'],
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
            const volume = parsetInt(args[0])

            if(!volume){
                message.quote(`Volume atual: \`${player.volume}\``)
            } else {
                if(!message.member.roles.cache.get(message.guildDb.djRole) && !message.author.id === client.config.owner && message.author.id !== player.queue.current.requester.id && message.guild.channels.cache.get(player.voiceChannel).members.filter(a => !a.user.bot).size > 1) return message.quote(`Somente DJ's e quem colocou a musica podem alterar o volume.`)
                if(isNaN(volume)) return message.quote('Coloque um volume entre 1 e 100.')
                if(volume > 100 && !message.author.id === client.config.owner) return message.quote('Coloque um volume entre 1 e 100.')
                if(volume < 1) return message.quote('Coloque um volume entre 1 e 100.')

                player.setVolume(volume)
                if(message.member.roles.cache.get(message.guildDb.djRole) || message.author.id === client.config.owner || message.author.id === player.queue.current.requester.id && message.guild.channels.cache.get(player.voiceChannel).members.filter(a => !a.user.bot).size > 1) player.vol = volume
                message.quote(`Volume definido para: \`${volume}\``)

            }

        } catch (error) {
            client.errorMessage(error, this, message)
        }
    }
}