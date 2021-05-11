const Discord = require('discord.js')
module.exports = async(client, player) => {
    const embed = new Discord.MessageEmbed()
    .setColor('#000000')
    .setTimestamp()
    .setDescription(`A fila de musicas acabou, caso queira escutar mais utilize \`-play\``)
    client.channels.cache.get(player.textChannel).send(embed)
    player.destroy()
}