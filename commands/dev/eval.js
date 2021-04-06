const Command = require('../../structures/Command')
const Discord = require('discord.js')
const { inspect } = require('util')
const Database = require('../../structures/Database')
const moment = require('moment')

module.exports = class Eval extends Command{
    constructor(client){
        super(client, {
            name: 'eval',
            args: true,
            usage: '(codigo)',
            description: 'Eval',
            aliases: ['e'],
            enabled: false,
            inVoiceChannel: false,
            sameVoiceChannel: false,
            playing: false,
            ownerOnly: true
        })
    }
    async run(client, message, args){
        if(message.author.id === client.config.owner){
            async function manu() {
              const configDb = await Database.Configs.findOne({_id: client.user.id})
              if(configDb.manu){
                configDb.manu = false
                configDb.save()
                return 'manutenção desligada'
              } else {
                configDb.manu = true
                configDb.save()
                return 'manutenção ligada'
              }
            }
            const input = args.join(' ').replace(/^`(``(js)?\s?)?|`(``)?$/g, '')
            const player = message.guild.player
            if(!input) {
              return message.channel.send('Coloca algo chifrudo')
            }
            if(input.includes('token')) return
        
            try {
              let code = await eval(input)
              code = typeof code !== 'string' ? inspect(code, { depth: 0 }) : code
        
              message.channel.send(`Resultado:\n\`\`\`js\n${clean(code.replace(new RegExp(process.env.token, 'g'), 'Piroca'))}\`\`\``)
            } catch (e) {
              return message.channel.send(e, { code: 'js' })
            }
        }
    }
}
function clean (text) {
    return typeof (text) === 'string' ? text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)) : text
}