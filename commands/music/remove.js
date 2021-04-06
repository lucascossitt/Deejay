const Command = require('../../structures/Command')

module.exports = class Remove extends Command{
    constructor(client){
        super(client, {
            name: 'remove',
            args: true,
            usage: '(numero da musica)',
            description: 'Remover musica',
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
            let num = Number(args[0])
            let numm = num - 1

            if(player.queue.length < 1) return message.quote('Não tem mais musicas na queue para serem removidas.')
            if(!num) return message.quote('Coloque o numero da musica que você deseja remover.')
            if(num < 1) return message.quote('Coloque o numero da musica que você deseja remover.')
            if(typeof player.queue[numm] === 'undefined') return message.quote('Coloque o numero de uma musica que esteja na queue.')
            if(!message.member.roles.cache.get(message.guildDb.djRole) && !message.author.id === client.config.owner && message.author.id !== player.queue[numm].requester.id && message.guild.channels.cache.get(player.voiceChannel).members.filter(a => !a.user.bot).size > 1) return message.quote(`Somente DJ's e quem colocou a musica podem remove-la.`)
            
            message.quote('A musica `' + player.queue[numm].title + '` foi removida.')
            player.queue.remove(numm)

        } catch (error) {
            client.errorMessage(error, this, message)
        }
    }
}