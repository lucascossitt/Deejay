const Command = require('../../structures/Command')

module.exports = class Stop extends Command{
    constructor(client){
        super(client, {
            name: 'stop',
            args: false,
            usage: '',
            description: 'Para musica',
            aliases: ['parar'],
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
            if(!message.member.roles.cache.get(message.guildDb.djRole) && !message.author.id === client.config.owner && message.guild.channels.cache.get(player.voiceChannel).members.filter(a => !a.user.bot).size > 1) return message.quote(`Somente DJ's podem parar a reprodução.`)

            player.destroy()
            message.quote('Parando reprodução.')

        } catch (error) {
            client.errorMessage(error, this, message)
        }
    }
}