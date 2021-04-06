const Event = require('../../structures/Event')

module.exports = class voiceStateUpdate extends Event{
    constructor(...args){
        super(...args)
    }

    async run(oldVoice, newVoice){
        const player = this.client.music.players.get(oldVoice.guild.id)

        if(!player) return
        if(!newVoice.guild.members.cache.get(this.client.user.id).voice.channelID) { this.client.channelscache.get(player.textChannel).send('Parei de tocar pois me desconectaram do canal'); player.destroy() }
        if(oldVoice.id === this.client.user.id) return
        if(!oldVoice.guild.members.cache.get(this.client.user.id).voice.channelID) return

        if(oldVoice.guild.members.cache.get(this.client.user.id).voice.channel.id === oldVoice.channelID){
            if(oldVoice.guild.voice.channel && oldVoice.guild.voice.channel.members.size === 1){
                const msg = await this.client.channels.cache.get(player.textChannel).send(`Parando de tocar em 60 segundos caso ninguem volte.`)
                const delay = ms => new Promise(res => setTimeout(res, ms))
                await delay(60000)

                const vcMembers = oldVoice.guild.voice.channel.members.size
                if(!vcMembers || vcMembers === 1){
                    const newPlayer = this.client.music.players.get(newVoice.guild.id)
                    msg.delete()
                    this.client.channels.cache.get(newPlayer.textChannel).send(`Parei de tocar pois me deixaram tocando sozinho.`)

                    if(newPlayer){
                        player.destroy()
                    } else {
                        oldVoice.guild.voice.channel.leave()
                    }
                } else {
                    return msg.delete()
                }
            }
        }
    }
}