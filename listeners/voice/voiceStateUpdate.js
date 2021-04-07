const Event = require('../../structures/Event')

module.exports = class voiceStateUpdate extends Event{
    constructor(...args){
        super(...args)
    }

    async run(oldVoice, newVoice){
        const guild = this.client.guilds.cache.get(oldVoice.guild.id)
        if(!guild.player) return
        let player = this.client.music.players.get(guild.id)

        if(!newVoice.guild.members.cache.get(this.client.user.id).voice.channelID){
            this.client.channels.cache.get(player.textChannel).send('Parei de tocar pois me desconectaram do canal') 
            return player.destroy()
        }
        if(guild.channels.cache.get(newVoice.channelID) && oldVoice.id === this.client.user.id && newVoice.channelID !== player.voiceChannel){
            this.client.music.player.get(newVoice.guild.id).voiceChannel = newVoice.channelID
            player = this.client.music.player.get(newVoice.guild.id)
            if(this.client.channels.cache.get(newVoice.channelID).members.filter(m => m.user.id !== this.client.user.id).size >= 1){
                player.pause(false)
            }
        }

        if(guild.channels.cache.get(newVoice.channelID) && newVoice.channelID === player.voiceChannel){
            if(player.paused) player.pause(false)
            if(player.opts){
                player.pause(false)
                if(!player.playing) player.play()
                clearTimeout(player.opts.timeout)
                player.opts.msg.delete()
                delete player.opts
            }
        } else {
            if(oldVoice.channelID !== player.voiceChannel) return;
            if(guild.channels.cache.get(oldVoice.channelID).members.filter(m => m.user.id != this.client.user.id && !m.user.bot).size == 0){
                guild.channels.cache.get(player.textChannel).send('Fui deixado tocando sozinho. A reprodução foi pausada por 1 minuto, caso ninguem volte sairei do canal.').then(async msg => {
                    player.pause(true)
                    player.opts = {}
                    player.opts.timeout = setTimeout(() => {
                        player.destroy()
                        msg.delete()
                        guild.channels.cache.get(player.textChannel).send('Parando a reprodução.')
                    }, 60000)
                    player.opts.msg = msg
                })
            }
        }
    }
}