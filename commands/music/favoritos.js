const Command = require('../../structures/Command')
const Discord = require('discord.js')
const db = require('../../structures/Database')
const Paginator = require('../../structures/Paginator')
const spawnPlayer = require('../../player/spawnPlayer')

module.exports = class Favoritos extends Command{
    constructor(client){
        super(client, {
            name: 'favoritos',
            args: false,
            usage: '',
            description: 'ver musicas favoritas',
            aliases: ['fav', 'favoritos'],
            enabled: true,
            inVoiceChannel: false,
            sameVoiceChannel: false,
            playing: false,
            ownerOnly: false
        })
    }

    async run(client, message, args){

        try {
            
            const userDb = await db.Users.findOne({_id: message.author.id})

            if(!args[0]){
        
                const musicas = userDb.favoritos
                const paginator = new Paginator({elements: musicas, length: 10})
                const embed = new Discord.MessageEmbed()
                .setColor('#B54ADB')
                .setTimestamp()
                .setFooter('Lab Music')
                .setTitle('Sua lista de musicas favoritas:')
                .setDescription(`\`lm.favoritos add\` - Adiciona a musica que esta tocando a sua lista de favoritos.\n\`lm.favoritos remove\` - Remove uma musica da sua lista de favoritos.\n\`lm.favoritos play\` - Toca uma musica da sua lista de favoritos.\n\nSem musicas`)
        
                if(musicas.length >= 1){
                    embed.setFooter('Página ' + paginator.pages.actual + ' de ' + paginator.pages.total)
                    embed.setDescription(`\`lm.favoritos add\` - Adiciona a musica que esta tocando a sua lista de favoritos.\n\`lm.favoritos remove\` - Remove uma musica da sua lista de favoritos.\n\`lm.favoritos play\` - Toca uma musica da sua lista de favoritos.\n\n${paginator.get(false).map(mapSongs.bind(null, paginator)).join('\n')}`)
                }
                const msg = await message.channel.send(embed)
                if(musicas.length <= 10) return
                const emojis = ['⬅️', '➡️']
        
                for(const emoji of emojis){
                    await msg.react(emoji)
                }
        
                const filter = (reaction, user) => user.id === message.author.id
                const collector = msg.createReactionCollector(filter, { time: 120000 })
        
                collector.on('collect', async (r, u) => {
                    switch (r.emoji.name) {
                      case emojis[0]: {
                        paginator.prevPage()
              
                        const isFirstPage = paginator.pages.actual === 1
                        const songs = paginator.get(isFirstPage)
              
                        embed.setDescription(`\`lm.favoritos add\` - Adiciona a musica que esta tocando a sua lista de favoritos.\n\`lm.favoritos remove\` - Remove uma musica da sua lista de favoritos.\n\`lm.favoritos play\` - Toca uma musica da sua lista de favoritos.\n\n${paginator.get(false).map(mapSongs.bind(null, paginator)).join('\n')}`)
                        embed.setFooter('Página ' + paginator.pages.actual + ' de ' + paginator.pages.total)
            
                        r.users.remove(message.author.id).catch(err => {})
                        msg.edit(embed)
                        break
                      }
              
                      case emojis[1]: {
                        const songs = paginator.nextPage().get()
            
                        embed.setDescription(`\`lm.favoritos add\` - Adiciona a musica que esta tocando a sua lista de favoritos.\n\`lm.favoritos remove\` - Remove uma musica da sua lista de favoritos.\n\`lm.favoritos play\` - Toca uma musica da sua lista de favoritos.\n\n${paginator.get(false).map(mapSongs.bind(null, paginator)).join('\n')}`)
                        embed.setFooter('Página ' + paginator.pages.actual + ' de ' + paginator.pages.total)
              
                        r.users.remove(message.author.id).catch(err => {})
                        msg.edit(embed)
                        break
                      }
                    }
                  })
                  collector.on('end', () => {
                      msg.delete()
                  })
        
            } else if(args[0].toLowerCase() === 'add'){
                if(!message.guild.player) return message.quote('Não estou tocando musica.')
                const player = message.guild.player
                const mscAtual = player.queue.current
                if(userDb.favoritos.find(a => a.identifier === mscAtual.identifier)){
                    message.quote('Esta musica ja esta na sua lista de favoritas. Caso deseja remove-la, utilize `lm.favoritos remove`.')
                } else {
                    userDb.favoritos.push({identifier: mscAtual.identifier, title: mscAtual.title})
                    userDb.save()
                    message.quote(`A musica \`${mscAtual.title}\` foi adicionada a sua lista de favoritas.`)
                }
            } else if(args[0].toLowerCase() === 'remove'){
                const num = args[1]
                if(!num) return message.quote('Coloque o numero da musica.')
                if(isNaN(num)) return message.quote('Coloque o numero da musica.')
                if(typeof userDb.favoritos[num - 1] === 'undefined') return message.quote('Coloque o numero de uma musica valida.')
        
                message.quote(`A musica \`${userDb.favoritos[num - 1].title}\` foi removida da sua lista de favoritos.`)
                userDb.favoritos.splice(num - 1, 1)
                userDb.save()
            } else if(args[0].toLowerCase() === 'play' || args[0].toLowerCase() === 'p'){
                const num = args[1]
                if(!num) return message.quote('Coloque o numero da musica.')
                if(isNaN(num)) return message.quote('Coloque o numero da musica.')
                if(typeof userDb.favoritos[num - 1] === 'undefined') return message.quote('Coloque o numero de uma musica valida.')
                const musicQuery = `https://www.youtube.com/watch?v=${userDb.favoritos[num - 1].identifier}`
                const canal = message.member.voice.channel
            
                if(!canal) return message.quote('Você não esta em um canal de voz.')
                const permissions = canal.permissionsFor(client.user)
                if(!permissions.has("CONNECT")) return message.quote('Não tenho permissão para entrar neste canal.');
                if(!permissions.has("SPEAK")) return message.quote('Não tenho permissão para tocar musica neste canal.');
                if(!message.guild.me.voice.channel && message.member.voice.channel.members.size === message.member.voice.channel.userLimit && !permissions.has('MOVE_MEMBERS')) return message.quote('O canal esta cheio.')
            
                const { loadType, except, tracks } = await client.music.search(musicQuery, message.author)
                if(except) return message.quote(except.message)
                if(loadType === 'NO_MATCHES') return message.quote('Não encontrei nenhum resultado para esta musica.')
                if(loadType === 'LOAD_FAILED') return message.quote(`Houve um erro ao carregar seu pedido.`)
                const player = await spawnPlayer(client, message)
                if(canal.id !== player.voiceChannel) return message.quote('Você não esta no mesmo canal que eu estou tocando.')
        
                const embed = new Discord.MessageEmbed()
                .setColor('#B54ADB')
                .setTimestamp()
                .setFooter('Lab Music')
                .setDescription(`Adicionado a queue: \`${tracks[0].title}\`\nDuração: \`${tracks[0].isStream ? 'Livestream' : `${client.transformarTempo(tracks[0].duration)}`}\`\nAdicionador por: ${tracks[0].requester}`)
                if(player.queue.current) message.quote(embed)
                player.queue.add(tracks[0])
                if(player.state !== 'CONNECTED') player.connect();
                if(!player.playing && !player.paused && !player.queue.size) player.play();
            } else {
                message.quote('Escolha entre `add, remove, play`.')
            }

        } catch (error) {
            client.errorMessage(error, this, message)
        }
    }
}
function getIndexSong ({ actual, length }) {
    return actual === 1 ? (actual - 1) * length + 1 : (actual - 1) * length + 1
}
function mapSongs (paginator, song, index) {
    return `**${getIndexSong(paginator.pages) + index} - **\`${song.title}\``
}