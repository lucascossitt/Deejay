const Command = require('../../structures/Command')

module.exports = class Skip extends Command{
    constructor(client){
        super(client, {
            name: 'skip',
            args: false,
            usage: '',
            description: 'Pular musica',
            aliases: ['s', 'pular'],
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
            if(!message.member.roles.cache.get(message.guildDb.djRole) && !message.author.id === client.config.owner && message.author.id !== player.queue.current.requester.id && message.guild.channels.cache.get(player.voiceChannel).members.filter(a => !a.user.bot).size > 1) return message.quote(`Somente DJ's e quem colocou a musica podem pular.`)
            player.stop()

        } catch (error) {
            client.errorMessage(error, this, message)
        }
    }
}