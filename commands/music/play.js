const Command = require('../../structures/Command')
const play = require('../../player/loadTracks')
const spawnPlayer = require('../../player/spawnPlayer')

module.exports = class Play extends Command{
    constructor(client){
        super(client, {
            name: 'play',
            args: true,
            usage: '(link ou nome da musica)',
            description: 'Tocar musica',
            aliases: ['p', 'tocar'],
            enabled: true,
            inVoiceChannel: true,
            sameVoiceChannel: true,
            playing: false,
            ownerOnly: false
        })
    }

    async run(client, message, args){

        try {
            
            let player = client.music.players.get(message.guild.id)
            if(!player) player = await spawnPlayer(client, message)
    
            const canal = message.member.voice.channel
            const permissions = canal.permissionsFor(client.user)
            if(!permissions.has("CONNECT")) return message.quote('Não tenho permissão para entrar neste canal.');
            if(!permissions.has("SPEAK")) return message.quote('Não tenho permissão para tocar musica neste canal.');
            if(!message.guild.me.voice.channel && message.member.voice.channel.members.size === message.member.voice.channel.userLimit && !permissions.has('MOVE_MEMBERS')) return message.quote('O canal esta cheio.')
    
            let searchQuery = args.join(' ')
            play(client, message, player, searchQuery, false)

        } catch (error) {
            client.errorMessage(error, this, message)
        }
    }
}