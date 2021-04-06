const fs = require('fs')
const categories = fs.readdirSync('./commands/')
const chalk = require('chalk')

module.exports = client => {
    try {
        categories.forEach(async(category) => {
            fs.readdir(`./commands/${category}/`, (err) => {
                if(err) return console.error(err)
                const init = async () => {
                    const commands = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'))
                    for(const file of commands) {
                        const f = require(`../commands/${category}/${file}`)
                        const command = new f(client)
                        client.commands.set(command.name.toLowerCase(), command)
                        if(command.aliases && Array.isArray(command.aliases)){
                            for(let i = 0; i < command.aliases.length; i++){
                                client.aliases.set(command.aliases[i], command)
                            }
                        }
                    }
                    client.log(chalk.green.bold(`[COMANDOS] `) + chalk.white.bold(`${commands.length} comandos carregados da categoria ${category}.`))
                }
                init()
            })
        })
    } catch (error) {
        client.log(error)
    }
}