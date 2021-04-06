const Command = require('../../structures/Command')
const Discord = require('discord.js')
const Database = require('../../structures/Database')
const moment = require('moment')

module.exports = class Liberar extends Command{
    constructor(client){
        super(client, {
            name: 'liberar',
            args: true,
            usage: '(add/remove/list/check)',
            description: 'Liberar servidor',
            aliases: [],
            enabled: true,
            inVoiceChannel: false,
            sameVoiceChannel: false,
            playing: false,
            ownerOnly: false
        })
    }

    async run(client, message, args){

        try {
            
            if(!message.member.roles.cache.get('529064475253407755') && !message.member.roles.cache.get('779008236535021608') && !message.author.id === client.config.owner) return message.quote('Você não tem permissão para usar este comando.')
            if(!args[0]) return message.quote('Escolha entre `add, remove, list, check`')
            if(args[0].toLowerCase() === 'add') {
                const id = args[1]
                const donator = message.guild.members.cache.get(args[2])
                if(!id) return message.quote('Coloque o ID do servidor.')
                if(!donator) return message.quote('Coloque o ID do donator.')
                const guildDb = await Database.Guilds.findOne({_id: id})
                const config = await Database.Configs.findOne({_id: client.user.id})
                if(config.guildsLiberadas.find(a => a.guildID === id)){
                    message.quote(`Esta guild ja esta liberada para o donator: ${client.users.cache.get(config.guildsLiberadas.find(a => a.guildID).donatorID).tag}`)
                } else {
                    if(!guildDb){
                        const newGuild = new Database.Guilds({_id: id})
                        newGuild.save()
                    }
                    config.guildsLiberadas.push({guildID: id, donatorID: donator.id})
                    config.save()
                    message.quote(`Guild liberada para o donator ${donator.user.tag}`)
                }
            } else if(args[0].toLowerCase() === 'remove'){
                const id = args[1]
                if(!id) return message.quote('Coloque o ID do servidor.')
                const config = await Database.Configs.findOne({_id: client.user.id})
                if(config.guildsLiberadas.find(a => a.guildID === id)){
                    const g = config.guildsLiberadas.find(a => a.guildID === id)
                    config.guildsLiberadas.splice(config.guildsLiberadas.indexOf(g), 1)
                    config.save()
                    message.quote(`Guild removida da lista de liberadas.`)
                } else {
                    message.quote(`Não achei nenhuma guild liberada com este ID.`)
                }
            } else if(args[0].toLowerCase() === 'list'){
                const donator = message.guild.members.cache.get(args[1])
                const config = await Database.Configs.findOne({_id: client.user.id})
                const embed = new Discord.MessageEmbed()
                .setColor('#B54ADB')
                .setFooter('Lab Music')
                .setTimestamp()
                if(donator){
                    embed.setDescription(`Lista de guilds liberadas do donator ${donator}:\n\n${config.guildsLiberadas.filter(a => a.donatorID === donator.id).map(a => `${client.guilds.cache.get(a.guildID) ? `${client.guilds.cache.get(a.guildID).name}(${a.guildID})` : `${a.guildID}`}`).join('\n') || 'nenhuma guild'}`)
                } else {
                    embed.setDescription(`Lista de guilds liberadas:\n\n${config.guildsLiberadas.map(a => `${client.guilds.cache.get(a.guildID) ? `${client.guilds.cache.get(a.guildID).name}(${a.guildID})` : `${a.guildID}`} - ${client.users.cache.get(a.donatorID)}`).join('\n') || 'nenhuma guild'}`)
                }
                message.quote(embed)
            } else if(args[0].toLowerCase() === 'check'){
                const config = await Database.Configs.findOne({_id: client.user.id})
                const msg = await message.quote('Checando guilds...')
                let num = 0
                client.guilds.cache.forEach(async guild => {
                    if(!config.guildsLiberadas.find(a => a.guildID === guild.id)){
                        num++
                        client.channels.cache.get(client.config.errorChannel).send(`Saindo da guild não liberada:\n\`\`\`Guild: ${guild.name}(${guild.id})\nData: ${moment(Date.now()).format('LLLL')}\`\`\``)
                        await guild.leave()
                    }
                })
                if(num > 0){
                    await msg.edit(`\`${num}\` guilds não liberadas, saindo delas.`)
                } else {
                    await msg.edit(`Não havia nenhuma guild não liberada.`)
                }
            } else {
                message.quote('Escolha entre `add, remove, list, check`.')
            }

        } catch (error) {
            client.errorMessage(error, this, message)
        }
    }
}