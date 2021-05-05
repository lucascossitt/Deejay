const Command = require('../../structures/Command')
const isAbsoluteUrl = require('is-absolute-url')
const Discord = require('discord.js')
const getLyrics = require('../../player/getLyrics')

module.exports = class Lyrics extends Command{
    constructor(client){
        super(client, {
            name: 'lyrics',
            args: false,
            usage: '',
            description: 'Ver letra de uma musica',
            aliases: ['letra'],
            enabled: true,
            inVoiceChannel: false,
            sameVoiceChannel: false,
            playing: false,
            ownerOnly: false
        })
    }

    async run(client, message, args){

        try {
            if(args[0]){
                if(isAbsoluteUrl(args[0])) return message.quote('Coloque uma musica, links não são permitidos.')
            }
            let lyric
            let titulo
            if(!args[0]){
                const player = client.music.players.get(message.guild.id)
                if(!player){
                  return message.quote('Coloque uma musica.')
                } else {
                  const [ artist, title ] = player.queue.current.title.split('-')
                  if(title){
                    lyric = await getLyrics(title, artist)
                    titulo = `${artist} - ${title}`
                  } else {
                    lyric = await getLyrics(player.queue.current.title)
                    titulo = `${player.queue.current.title}`
                  }
                }
            } else {
                const data = args.join(' ').split('-')
                if(data.length === 1){
                  lyric = await getLyrics(data[0].trim())
                  titulo = `${data[0].trim()}`
                } else {
                  lyric = await getLyrics(data[0].trim(), data[1].trim())
                  titulo = `${data[1].trim()} - ${data[0].trim()}`
                }
            }

            if(!lyric) return message.quote('Não achei nenhum resultado')

            let page = 1
            let pages = Math.ceil(lyric.lyrics.length / 20)
            const embed = new Discord.MessageEmbed()
            .setColor('#000000')
            .setTitle(titulo)
            .setDescription(lyric.lyrics.slice(0, 20).join('\n'))
            .setTimestamp()
            .setFooter(`Pagina: ${page}/${pages}`)

            const msg = await message.channel.send(embed)
            msg.react('⬅️')
            msg.react('➡️')

            const filter = (r, u) => (r.name === '⬅️' || r.name === '➡️') && u.id === message.author.id

            const collector = msg.createReactionCollector(filter, { time: 60000 })

            collector.on('collect', r => {
              if(message.channel.type !== 0) return
              reaction.users.remove(message.author.id)
              changePage(r)
            })

            collector.on('end', () => {
              msg.delete()
            })

            async function changePage(r){
              if(!lyric) return
              switch(r.name){
                case '⬅️':
                  if(page === 1) return
                  page--
                  break
                case '➡️':
                  if(page === pages) return
                  page++
                  break
              }

              embed.setDescription(lyric.lyrics.slice((page - 1) * 20, page * 20).join('\n'))
              .setFooter(`Pagina: ${page}/${pages}`)
              msg.edit(embed)
            }

        } catch (error) {
            client.errorMessage(error, this, message)
        }
    }
}