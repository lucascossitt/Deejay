const Command = require('../../structures/Command')
const Discord = require('discord.js')

module.exports = class Lavalink extends Command{
    constructor(client){
        super(client, {
            name: 'lavalink',
            args: false,
            usage: '',
            description: 'Informações do lavalink',
            aliases: [],
            enabled: false,
            inVoiceChannel: false,
            sameVoiceChannel: false,
            playing: false,
            ownerOnly: true
        })
    }
    async run(client, message, args){

        try {

            const { memory, cpu, uptime, frameStats, playingPlayers, players } = client.music.nodes.first().stats
            
            const allocated = Math.floor(memory.allocated / 1024 / 1024);
            const used = Math.floor(memory.used / 1024 / 1024);
            const free = Math.floor(memory.free / 1024 / 1024);
            const reservable = Math.floor(memory.reservable / 1024 / 1024);
    
            const systemLoad = (cpu.systemLoad * 100).toFixed(2);
            const lavalinkLoad = (cpu.lavalinkLoad * 100).toFixed(2);

            const botUptime = this.uptime(uptime);

            const embed = new Discord.MessageEmbed()
            .setColor('#000000')
            .setTimestamp()
            .setDescription(`Informações do node \`${client.music.nodes.first().options.identifier}\`\nUptime: \`${botUptime}\`\nCPU: \n> Cores: \`${cpu.cores}\`\n> Uso: \`${systemLoad}%\`\n> Uso lavalink: \`${lavalinkLoad}%\`\nMemória: \n> Alocada: \`${allocated}MB\`\n> Usada: \`${used}MB\`\n> Livre: \`${free}MB\`\n> Reservada: \`${reservable}MB\``)

            if(frameStats){
                const { sent, deficit, nulled } = frameStats
                embed.addField('Frame Stats', `\`\`\`Sent: ${sent}\nDeficit: ${deficit}\nNulled: ${nulled}\`\`\``)
            }

            message.quote(embed)

        
        } catch (error) {
            client.errorMessage(error, this, message)
        }
    }
    uptime(time) {
        const calculations = {
            semana: Math.floor(time / (1000 * 60 * 60 * 24 * 7)),
            dia: Math.floor(time / (1000 * 60 * 60 * 24)),
            hora: Math.floor((time / (1000 * 60 * 60)) % 24),
            minuto: Math.floor((time / (1000 * 60)) % 60),
            segundo: Math.floor((time / 1000) % 60),
        };

        let str = '';

        for (const [key, val] of Object.entries(calculations)) {
            if (val > 0) str += `${val} ${key}${val > 1 ? 's' : ''} `;
        }

        return str;
    }
}