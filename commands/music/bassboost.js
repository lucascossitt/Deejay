const Command = require('../../structures/Command')

module.exports = class BassBoost extends Command{
    constructor(client){
        super(client, {
            name: 'bassboost',
            args: false,
            usage: '',
            description: 'Ligar bassboost',
            aliases: ['bass'],
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
            if(!message.member.roles.cache.get(message.guildDb.djRole) && !message.author.id === client.config.owner && message.author.id !== player.queue.current.requester.id && message.guild.channels.cache.get(player.voiceChannel).members.filter(a => !a.user.bot).size > 1) return message.quote(`Somente DJ's e quem colocou a musica podem ligar o bassboost.`)

            if(message.member.roles.cache.get(message.guildDb.djRole) || message.author.id === client.config.owner){
                if(player.bassboost){
                    message.quote('Bassboost desativado.')
                    player.setEQ({band: 1, gain: 0})
                    player.bassboost = false
                } else {
                    message.quote('Bassboost ativado.')
                    player.setEQ({band: 1, gain: 0.5})
                    player.bassboost = true
                }
            } else {
                if(player.bands[1] !== 0){
                    message.quote('Bassboost desativado para sua musica.')
                    player.setEQ({band: 1, gain: 0})
                } else {
                    message.quote('Bassboost ativado para sua musica.')
                    player.setEQ({band: 1, gain: 0.5})
                }
            }

        } catch (error) {
            client.errorMessage(error, this, message)
        }
    }
}