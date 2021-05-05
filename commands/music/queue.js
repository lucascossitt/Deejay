const Command = require('../../structures/Command')
const Paginator = require('../../structures/Paginator')
const moment = require('moment')
const Discord = require('discord.js')


module.exports = class Queue extends Command{
    constructor(client){
        super(client, {
            name: 'queue',
            args: false,
            usage: '',
            description: 'Ver fila de musica',
            aliases: [],
            enabled: true,
            inVoiceChannel: false,
            sameVoiceChannel: false,
            playing: true,
            ownerOnly: false
        })
    }

    async run(client, message, args){

        try {
            
            const player = message.guild.player
            const paginator = new Paginator({elements: player.queue, length: 10})
        
            const embed = new Discord.MessageEmbed()
            .setColor('#000000')
            .setTitle('Fila de musicas')
            .setTimestamp()
            .setDescription(`Tocando agora: \`${player.queue.current.title}\`\n\nSem mais musicas`)
        
            if(player.queue.length >= 1){
                embed.setDescription(`Tocando agora: \`${player.queue.current.title}\`\n\nProximas musicas:\n${paginator.get(false).map(mapSongs.bind(null, paginator)).join('\n')}`)
                embed.setFooter('Página ' + paginator.pages.actual + ' de ' + paginator.pages.total)
            }
            const msg = await message.channel.send(embed)
            if (player.queue.length <= 10) return
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
          
                    embed.setDescription(`Tocando agora: \`${player.queue.current.title}\`\n\nPróximas músicas:\n${paginator.get(false).map(mapSongs.bind(null, paginator)).join('\n')}`)
                    embed.setFooter('Página ' + paginator.pages.actual + ' de ' + paginator.pages.total)
        
                    r.users.remove(message.author.id).catch(err => {})
                    msg.edit(embed)
                    break
                  }
          
                  case emojis[1]: {
                    const songs = paginator.nextPage().get()
        
                    embed.setDescription(`Tocando agora: \`${player.queue.current.title}\`\n\nPróximas músicas:\n${paginator.get(false).map(mapSongs.bind(null, paginator)).join('\n')}`)
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

        } catch (error) {
            client.errorMessage(error, this, message)
        }
    }
}
function getIndexSong ({ actual, length }) {
    return actual === 1 ? (actual - 1) * length + 1 : (actual - 1) * length + 1
}
  
function mapSongs (paginator, song, index) {
    return `**${getIndexSong(paginator.pages) + index} - **\`${song.title}\` (Requisitado por: ${song.requester})`
}