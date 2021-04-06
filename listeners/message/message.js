const Discord = require('discord.js')
const chalk = require('chalk')
const Event = require('../../structures/Event')
const moment = require('moment')
const Database = require('../../structures/Database')

module.exports = class Message extends Event{
    constructor(...args){
        super(...args)
    }

    async run(message){
        if(message.author.bot) return
        if(message.channel.type === 'text'){
            if(!message.guild.members.cache.get(this.client.user.id)) await message.guild.members.fetch(this.client.user.id)
            if(!message.channel.permissionsFor(message.guild.me).missing('SEND_MESSAGES')) return
        }
        if(!message.channel.guild) return

        const mentionPrefix = new RegExp(`^<@!?${this.client.user.id}>( |)$`)
        const rawMessageContent = message.content.toLowerCase()

        let prefix
        prefix = rawMessageContent.split(' ')[0].match(mentionPrefix) || this.client.config.prefix
        if(rawMessageContent.indexOf(this.client.config.prefix) === 0){
            prefix = this.client.config.prefix
        } else if(rawMessageContent.split(' ')[0].match(mentionPrefix)){
            prefix = mentionPrefix
        } else {
            return
        }

        let args
        let command

        const messageContent = message.content.replace('`', '')

        if(prefix === this.client.config.prefix && !this.client.config.prefix.endsWith(' ')){
            args = messageContent.split(' ')
            command = args.shift().toLowerCase()
            command = command.slice(this.client.config.prefix.length)
        } else if(prefix === this.client.config.prefix){
            args = messageContent.split(' ')
            args.shift()
            command = args.shift().toLowerCase()
        } else {
            args = message.content.split(' ')
            args.shift()
            command = args.shift().toLowerCase()
        }

        await runCommand(this.client)

        async function runCommand(client){
            let cmd
            if(client.commands.has(command)) cmd = client.commands.get(command)
            else if(client.aliases.has(command)) cmd = client.aliases.get(command)
            else return

            const permissions = message.channel.permissionsFor(client.user)
            if(!permissions.has('SEND_MESSAGES') || !permissions.has('READ_MESSAGE_HISTORY')) return message.quote(`Eu não tenho permissão para falar no canal ${message.channel.name}.`)
            if(!permissions.has('EMBED_LINKS')) return message.quote('Eu não tenho permissão para mandar embeds neste canal.')

            const guildDb = await Database.Guilds.findOne({_id: message.guild.id})
            const configDb = await Database.Configs.findOne({_id: client.user.id})
            const userDb = await Database.Users.findOne({_id: message.author.id})

            if(!userDb){
                const newUser = new Database.Users({_id: message.author.id})
                newUser.save()
                client.log(chalk.green.bold('[DATABASE] ') + chalk.white.bold(`${message.author.name} salvo na database.`))
            }

            if(configDb.manu && !message.author.id === client.config.owner) return message.react('❌')
            if(guildDb.lock && !message.member.roles.cache.get(guildDb.staffRole) && !message.author.id === client.config.owner) return message.quote('Estou trancado, somente a staff pode utilizar meus comandos.')
            if(guildDb.canaisBloqueados.includes(message.channel.id) && !message.member.roles.cache.get(guildDb.staffRole) && !message.author.id === client.config.owner) return
            if(guildDb.banidos.includes(message.author.id)) return message.quote('Você esta banido de usar meus comandos neste servidor.')
            message.guildDb = guildDb
            message.userDb = userDb

            if(cmd.ownerOnly && !message.author.id === client.config.owner) return
            if(!cmd.enabled && !message.author.id === client.config.owner) return
            if(!message.guild) return

            if(cmd.inVoiceChannel && !message.member.voice.channel) return message.quote('Você não esta em um canal de voz.')
            else if(cmd.sameVoiceChannel && message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channelID) return message.quote('Você não esta no mesmo canal de voz que eu estou.')
            else if(cmd.playing && !client.music.players.get(message.guild.id)) return message.quote('Não estou tocando nada.')

            if(prefix == client.config.prefix){
                if(!args[0] && cmd.args === true) return message.quote(`Você não colocou todos os argumentos necessarios. Uso correto: \`${client.config.prefix}${cmd.name} ${cmd.usage}\``)
            }

            try {
                cmd.run(client, message, args)
                client.cmdUsado += 1
                client.channels.cache.get(client.config.comandosChannel).send(`Comando usado: \`${cmd.name}\`\n\`\`\`Guild: ${message.guild.name}(${message.guild.id})\nUsuario: ${message.author.tag}(${message.author.id})\nData: ${moment(Date.now()).format('LLLL')}\`\`\``)
            } catch (error) {
                client.errorMessage(error, cmd, message)
            }
        }
    }
}