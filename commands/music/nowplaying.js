const Command = require('../../structures/Command')
const TimeUtils = require('../../structures/TimeUtils')
const Discord = require('discord.js')

module.exports = class nowPlaying extends Command{
    constructor(client){
        super(client, {
            name: 'nowplaying',
            args: false,
            usage: '',
            description: 'Musica tocando',
            aliases: ['np', 'tocando'],
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
            const current = player.queue.current
            const embed = new Discord.MessageEmbed()
            .setColor('#000000')
            .setTitle(`${current.title}`)
            .setURL(current.uri)
            .setThumbnail(current.thumbnail)
            .setFooter(`Volume: ${player.volume} | Pausado: ${player.paused ? 'Sim' : 'Não'}`)
            if(current.isStream){
                embed.setDescription(`\`Livestream\`\nAdicionado por: ${current.requester}`)
            } else {
                embed.setDescription(`\`\`\`[${TimeUtils.msToTime(player.position)}] ${TimeUtils.progress({ total: current.duration, current: player.position, length: 24 })} [${TimeUtils.msToTime(current.duration)}]\`\`\`\nAdicionado por: ${current.requester}`)
            }
            message.quote(embed)

        } catch (error) {
            client.errorMessage(error, this, message)
        }
    }
}