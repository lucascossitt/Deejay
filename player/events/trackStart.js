const Discord = require('discord.js')
module.exports = async(client, player, track) => {
    if(player.bassboost === 'undefined' || player.bassboost === false) player.clearEQ()
    player.setVolume(player.vol)
    
    const embed = new Discord.MessageEmbed()
    .setColor('#000000')
    .setTimestamp()
    .setDescription(`Tocando agora: \`${track.title}\`\nDuração: \`${track.isStream ? 'Livestream' : `${client.transformarTempo(track.duration)}`}\`\nAdicionado por: ${track.requester}`)
    const msg = await client.channels.cache.get(player.textChannel).send(embed)
    if(track.duration > 1 && !track.isStream){
        msg.delete({ timeout: track.duration })
    }
}