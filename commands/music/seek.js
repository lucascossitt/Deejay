const Command = require('../../structures/Command')

module.exports = class Seek extends Command{
    constructor(client){
        super(client, {
            name: 'seek',
            args: true,
            usage: '(tempo)',
            description: 'Pular para um tempo da musica',
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
            if(!message.member.roles.cache.get(message.guildDb.djRole) && !message.author.id === client.config.owner && message.author.id !== player.queue.current.requester.id && message.guild.channels.cache.get(player.voiceChannel).members.filter(a => !a.user.bot).size > 1) return message.quote(`Somente DJ's e quem colocou a musica podem pular para um tempo da musica.`)

            if(!player.queue.current.isSeekable) return message.quote('Não é possivel fazer isto nesta musica.')
            const tempo = args.join(' ')
            if(!tempo) return message.quote('Coloque um tempo valido. (Ex: 02:00)')
            var a = tempo.split(':');
            var seconds;
            if(a[2]){
              seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])
            } else if(a[1]){
              seconds = (+a[0]) * 60 + (+a[1])
            } else {
              seconds = a[0]
            }
            var ms = seconds * 1000
            if(ms >= player.queue.current.duration) return message.quote('Coloque um tempo que seja menor que a duração da musica.')
            player.seek(ms)
            message.quote('Pulado para o tempo: `' + tempo + '`')

        } catch (error) {
            client.errorMessage(error, this, message)
        }
    }
}