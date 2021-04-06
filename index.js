require('dotenv').config()
require('./structures/discord')
const mongoose = require('mongoose')
const chalk = require('chalk')
const moment = require('moment')
moment.locale('pt_BR')

const Client = require('./structures/Client')
const client = new Client()
client.login(process.env.token)

mongoose.connect(process.env.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    client.log(chalk.green.bold('[DATABASE] ') + chalk.white.bold('Conectado.'))
})

require(`./handlers/commands`)(client)
require(`./handlers/events`)(client)