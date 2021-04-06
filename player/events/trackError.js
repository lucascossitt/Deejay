const Discord = require('discord.js')
module.exports = async(client, player, track, payload) => {
    if(payload.error === 'Track information is unavailable.'){
        const embed = new Discord.MessageEmbed()
        .setColor('#B54ADB')
        .setTimestamp()
        .setFooter('Lab Music')
        .setDescription(`Erro ao tocar. Provavelmente esta musica tem recomendação para maiores de idade.`)
        client.channels.cache.get(player.textChannel).send(embed)
        if(player.queue.size === 0){
          player.destroy()
        }
    }
}