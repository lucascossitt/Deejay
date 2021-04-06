const Command = require('../../structures/Command')
const Discord = require('discord.js')
const moment = require('moment')

module.exports = class Info extends Command{
    constructor(client){
        super(client, {
            name: 'info',
            args: false,
            usage: '',
            description: 'Informações',
            aliases: ['botinfo'],
            enabled: true,
            inVoiceChannel: false,
            sameVoiceChannel: false,
            playing: false,
            ownerOnly: false
        })
    }
    async run(client, message, args){

        try {

            let node = client.music.nodes.first().stats
            let u = this.convertMS(client.uptime);
            let ul = this.convertMS(node.uptime)
            let uptime = u.d === 0 ? `${u.h}h ${u.m}m ${u.s}s` : `${u.d}d ${u.h}h ${u.m}m ${u.s}s`
            let uptimeLava = ul.d === 0 ? `${ul.h}h ${ul.m}m ${ul.s}s` : `${ul.d}d ${ul.h}h ${ul.m}m ${ul.s}s`
            const embed = new Discord.MessageEmbed()
            .setColor('#B54ADB')
            .setDescription(`Bot oficial de musica do servidor [LabNegro](https://discord.gg/AcmhNjG)\nDesenvolvido em JavaScript, utilizando [Discord.JS](https://www.npmjs.com/package/discord.js) para comunicação com a API do Discord e [Erela.JS](https://www.npmjs.com/package/erela.js) como wrapper para o Lavalink. Desenvolvido por ${client.users.cache.get('227457062643171338')}`)
            .addField('Estatisticas do Bot:', `Ping: \`${Math.round(client.ws.ping)}ms\`\nUptime: \`${uptime}\`\nComandos usados: \`${client.cmdUsado}\``, true)
            .addField('Estatisticas do Lavalink:', `Uptime: \`${uptimeLava}\`\nRAM usada: \`${Math.round((node.memory.used / 1024 / 1024) * 100) / 100}MB\`\nUso da CPU: \`${client.music.nodes.first().stats.cpu.lavalinkLoad.toFixed(2)}%\``, true)
            .setTimestamp()
            .setThumbnail(client.user.avatarURL())
            .setFooter(`Lab Music`)
            message.quote(embed)

        } catch (error) {
            client.errorMessage(error, this, message)
        }
    }

    convertMS(ms) {
        var d, h, m, s;
        s = Math.floor(ms / 1000);
        m = Math.floor(s / 60);
        s = s % 60;
        h = Math.floor(m / 60);
        m = m % 60;
        d = Math.floor(h / 24);
        h = h % 24;
        return {
            d: d,
            h: h,
            m: m,
            s: s
        };
    }
}