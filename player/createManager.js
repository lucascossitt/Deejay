const { Manager } = require('erela.js')
const Spotify = require('erela.js-spotify')
const chalk = require('chalk')

const trackStart = require('./events/trackStart.js')
const trackEnd = require('./events/trackEnd.js')
const queueEnd = require('./events/queueEnd.js')
const trackError = require('./events/trackError.js')

module.exports = async (client) => {
    client.music = new Manager({
        nodes: [{ identifier: 'VPS1', host: process.env.hostLava, port: 2333, password: process.env.passLava }, {identifier: 'VPS2', host: process.env.hostLava2, port: 2333, password: process.env.passLava}],
        plugins: [
            new Spotify({
                clientID: process.env.sptfClientId,
                clientSecret: process.env.sptfClientSecret
            })
        ],
        send(id, payload){
            const guild = client.guilds.cache.get(id);
            if (guild) guild.shard.send(payload);
        }
    })
    
    .on('nodeConnect', (node) => {client.log(chalk.green.bold(`[LAVALINK] `) + chalk.white.bold(`Node ${node.options.identifier} conectado.`))})
    .on('nodeError', (node, error) => client.log(`Node error: ${error.message}`))

    .on('trackError', (player, track, payload) => { trackError(client, player, track, payload) })
    .on('queueEnd', (player) => { queueEnd(client, player) })
    .on('trackStart', (player, track) => { trackStart(client, player, track) })
    .on('trackEnd', (player, track) => { trackEnd(client, player, track) })
    .on('playerMove', (player, oldChannel, newChannel) => { player.voiceChannel = newChannel })
}