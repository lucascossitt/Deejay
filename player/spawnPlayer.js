const { Player } = require('erela.js')

module.exports = async(client, message) => {
    const player = new Player({
        guild: message.guild.id,
        textChannel: message.channel.id,
        voiceChannel: message.member.voice.channel.id,
        selfDeafen: true,
        volume: 50
    })

    player.vol = 50
    player.bassboost = false
    player.connect()

    return player
}