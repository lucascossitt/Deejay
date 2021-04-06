const Discord = require('discord.js')
module.exports = async(client, player) => {
    const embed = new Discord.MessageEmbed()
    .setColor('#B54ADB')
    .setTimestamp()
    .setFooter('Lab Music')
    .setDescription(`A fila de musicas acabou, caso queira escutar mais utilize \`lm.play\``)
    client.channels.cache.get(player.textChannel).send(embed)
    player.destroy()
}