const fs = require('fs')
const eventFolders = fs.readdirSync('./listeners/')
const chalk = require('chalk')

module.exports = (client) => {
    eventFolders.forEach(async(eventFolder) => {
        const events = fs.readdirSync(`./listeners/${eventFolder}`)
        const jsevents = events.filter(c => c.split('.').pop() === 'js')
        for(let i = 0; i < jsevents.length; i++){
            if(!events.length) throw Error('Nenhum arquivo de evento achado.')
            if(!jsevents.length) throw Error('Nenhum arquivo de evento javascript achado.')
            const file = require(`../listeners/${eventFolder}/${jsevents[i]}`)
            const event = new file(client, file)
            if(typeof event.run !== 'function') throw Error(`Nenhuma função run achada em ${jsevents[i]}`)
            const name = jsevents[i].split('.')[0]
            client.on(name, (...args) => event.run(...args))
        }
        client.log(chalk.green.bold(`[EVENTOS] `) + chalk.white.bold(`${jsevents.length} eventos carregados da categoria ${eventFolder}.`))
    })
}