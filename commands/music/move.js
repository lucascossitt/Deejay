const Command = require('../../structures/Command')

module.exports = class Move extends Command{
    constructor(client){
        super(client, {
            name: 'move',
            args: true,
            usage: '(de) (para)',
            description: 'Mover musica',
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
            if(!message.member.roles.cache.get(message.guildDb.djRole) && !message.author.id === client.config.owner && message.author.id !== player.queue.current.requester.id && message.guild.channels.cache.get(player.voiceChannel).members.filter(a => !a.user.bot).size > 1) return message.quote(`Somente DJ's e quem colocou a musica podem mover.`)

            let de = Number(args[0])
            let para = Number(args[1])
            const dee = de - 1
            const paraa = para - 1
            if(!de) return message.quote('Coloque o numero da musica que você deseja mover.')
            if(!para) return message.quote('Coloque a posição para onde você deseja mover a musica.')
            if(typeof player.queue[dee] === 'undefined') return message.quote('Coloque o numero de uma musica valida.')
            message.quote('Você moveu a musica `' + player.queue[dee].title + '` para a posição `' + para + '`')
            arraymove(player.queue, dee, paraa)

        } catch (error) {
            client.errorMessage(error, this, message)
        }
    }
    
    arraymove(arr, fromIndex, toIndex) {
        var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
    }
}