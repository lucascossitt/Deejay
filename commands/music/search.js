const Command = require('../../structures/Command')
const spawnPlayer = require('../../player/spawnPlayer')
const Discord = require('discord.js')
const escolhendo = []
const moment = require('moment')

module.exports = class Search extends Command{
    constructor(client){
        super(client, {
            name: 'search',
            args: true,
            usage: '(nome da musica)',
            description: 'Buscar musica',
            aliases: ['buscar'],
            enabled: true,
            inVoiceChannel: true,
            sameVoiceChannel: true,
            playing: false,
            ownerOnly: false
        })
    }

    async run(client, message, args){

        try {
            
            const musicQuery = args.join(' ')
            const canal = message.member.voice.channel
        
            if(!musicQuery) return message.quote('Insira o nome uma musica para buscar.')
            if(!canal) return message.quote('Você não esta em um canal de voz.')
            const permissions = canal.permissionsFor(client.user)
            if(!permissions.has("CONNECT")) return message.quote('Não tenho permissão para entrar neste canal.');
            if(!permissions.has("SPEAK")) return message.quote('Não tenho permissão para tocar musica neste canal.');
            if(!message.guild.me.voice.channel && message.member.voice.channel.members.size === message.member.voice.channel.userLimit && !permissions.has('MOVE_MEMBERS')) return message.quote('O canal esta cheio.')
            if(escolhendo.includes(message.author.id)) return message.quote('Você ja esta pesquisando por uma musica.')
        
            const { loadType, except, tracks, playlist } = await client.music.search(musicQuery, message.author)
        
            if(except) console.log(except.message)
            if(loadType === 'NO_MATCHES') return message.quote('Não encontrei nenhum resultado para esta musica.')
            if(loadType === 'LOAD_FAILED') return message.quote('Houve um erro ao carregar esta musica.')
            const player = await spawnPlayer(client, message)
            if(canal.id !== player.voiceChannel) return message.quote('Você não esta no mesmo canal que eu estou tocando.')
            if(loadType === 'SEARCH_RESULT' || loadType === 'TRACK_LOADED'){
                escolhendo.push(message.author.id)
                const embedSearch = new Discord.MessageEmbed()
                .setColor('#000000')
                .setDescription(`Resultados para: \`${musicQuery}\`\n\n${tracks.map((a, i) => `**${i + 1} -** \`${a.title}\``).slice(0, 10).join('\n')}`)
                .setFooter('Selecione um numero de 1 a 10 de acordo com o resultado ou digite cancelar para cancelar! (Tempo: 15 segundos)')
                message.quote(embedSearch).then(async msg => {
                    const filter = m => m.author.id === message.author.id;
                    const collector = msg.channel.createMessageCollector(filter, { time: 15000 });
        
                    collector.on('collect', async coletado => {
                        if(coletado.content === 'cancelar'){
                            collector.stop()
                        } else if(coletado.content > 0 && coletado.content < 11){
                            collector.stop()
                            const embed = new Discord.MessageEmbed()
                            .setColor('#000000')
                            .setTimestamp()
                            .setDescription(`Adicionado a queue: \`${tracks[Number(coletado.content) - 1].title}\`\nDuração: \`${tracks[Number(coletado.content) - 1].isStream ? 'Livestream' : `${client.transformarTempo(tracks[Number(coletado.content) - 1].duration)}`}\`\nAdicionador por: ${tracks[Number(coletado.content) - 1].requester}`)
                            if(player.queue.current) message.quote(embed)
                            player.queue.add(tracks[Number(coletado.content) - 1])
                            if(player.state !== 'CONNECTED') player.connect();
                            if(!player.playing && !player.paused && !player.queue.size) player.play();
                        }
                    })
                    collector.on('end', () => {
                        msg.delete()
                        escolhendo.splice(escolhendo.indexOf(message.author.id), 1)
                    })
                })
            }

        } catch (error) {
            client.errorMessage(error, this, message)
        }
    }
}