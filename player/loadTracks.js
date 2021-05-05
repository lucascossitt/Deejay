const ytsr = require('ytsr')
const Discord = require('discord.js')

module.exports = async(client, message, player, searchQuery, first) => {

    let tries = 0

    async function load(search){

        const res = await client.music.search(search, message.author)

        if(res.loadType !== 'NO_MATCHES' && res.loadType !== 'LOAD_FAILED'){

            if(res.loadType == 'TRACK_LOADED' || res.loadType == 'SEARCH_RESULT'){

                if(player.queue.current){
                    const embed = new Discord.MessageEmbed()
                    .setColor('#000000')
                    .setTimestamp()
                    .setDescription(`Adicionado a queue: \`${res.tracks[0].title}\`\nDuração: \`${res.tracks[0].isStream ? 'Livestream' : `${client.transformarTempo(res.tracks[0].duration)}`}\`\nAdicionador por: ${message.author}`)
                    message.quote(embed)
                }
                if(first){
                    player.queue.splice(0, 0, res.tracks[0])
                } else {
                    player.queue.add(res.tracks[0])
                }
                if(!player.playing && !player.paused && !player.queue.length) player.play()

            } else if(res.loadType == 'PLAYLIST_LOADED'){

                if(first) return message.quote('Não se pode colocar playlists por primeiro.')
                for(const track of res.tracks){
                    player.queue.add(track)
                    if(!player.playing && !player.paused && !player.queue.length) player.play()
                }

                const embed = new Discord.MessageEmbed()
                .setColor('#000000')
                .setTimestamp()
                .setDescription(`Playlist carregada: \`${res.playlist.name}\`\nQuantidade de musicas: \`${res.tracks.length}\`\nAdicionador por: ${message.author}`)
                message.quote(embed)
            }

            return

        } else {

            const searchResult = await ytsr(searchQuery, { limit: 1})
            if(searchResult.results === 0) return message.quote('não achei nenhum resultado')
            if(tries > 7){

                return message.quote('não achei nenhum resultado')

            } else {

                tries++
                return load(searchResult.items[0].link)

            }
        }
    }
    return load(searchQuery)
}