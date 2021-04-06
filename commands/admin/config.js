const Command = require('../../structures/Command')
const Database = require('../../structures/Database')
const Discord = require('discord.js')

module.exports = class Config extends Command{
    constructor(client){
        super(client, {
            name: 'config',
            args: false,
            usage: '',
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
            
            const guilddb = await Database.Guilds.findOne({_id: message.guild.id})
            if(!message.member.roles.cache.get(guilddb.staffRole) && !message.author.id === client.config.owner) return message.quote('Você não tem permissão para usar este comando.')
        
            if(!args[0]){
                const embed = new Discord.MessageEmbed()
                .setColor('#B54ADB')
                .setTitle('Minhas configurações no servidor:')
                .setFooter('Opções de configurações disponiveis: set/lock/ban')
                .setTimestamp()
                .setDescription(`Cargo de DJ: ${message.guild.roles.cache.get(guilddb.djRole) || '`não definido`'}\nCargo de Staff: ${message.guild.roles.cache.get(guilddb.staffRole) || '`não definido`'}\nTrancado: ${guilddb.lock ? '`sim`' : '`não`'}`)
                .addField('Membros banidos:', `${guilddb.banidos.map(a => client.users.cache.get(a)).join(', ') || '`nenhum membro banido`'}`)
                .addField('Canais bloqueados:', `${guilddb.canaisBloqueados.map(a => message.guild.channels.cache.get(a)).join(', ') || '`nenhum canal bloqueado`'}`)
                message.quote(embed)
            } else {
                switch(args[0].toLowerCase()){
                    case 'set':
                        const op = args[1]
                        if(!op) return message.quote('Escolha entre `dj, staff, canalblock`.')
                        const id = args[2]
                        if(!id) return message.quote('Coloque o ID.')
                        if(op.toLowerCase() === 'dj'){
                            const cargo = message.guild.roles.cache.get(id)
                            if(!cargo) return message.quote('Não encontrei este cargo.')
                            guilddb.djRole = id
                            guilddb.save()
                            message.quote('Cargo de DJ definido para ' + cargo.name)
                        } else if(op.toLowerCase() === 'staff'){
                            const cargo = message.guild.roles.cache.get(id)
                            if(!cargo) return message.quote('Não encontrei este cargo.')
                            guilddb.staffRole = id
                            guilddb.save()
                            message.quote('Cargo de Staff definido para ' + cargo.name)
                        } else if(op.toLowerCase() === 'canalblock'){
                            const canal = message.mentions.channels.first() ? message.mentions.channels.first() : message.guild.channels.cache.get(id)
                            if(!canal) return message.quote('Não encontrei este canal.')
                            if(guilddb.canaisBloqueados.includes(canal.id)){
                                guilddb.canaisBloqueados.splice(guilddb.canaisBloqueados.indexOf(canal.id), 1)
                                guilddb.save()
                                message.quote(`${canal} removido da lista de bloqueados.`)
                            } else {
                                guilddb.canaisBloqueados.push(canal.id)
                                guilddb.save()
                                message.quote(`${canal} adicionado a lista de bloqueados.`)
                            }
        
                        } else {
                            message.quote('Escolha entre `dj, staff, canalblock`.')
                        }
                        break;
        
                    case 'lock':
                        if(guilddb.lock){
                            guilddb.lock = false
                            guilddb.save()
                            message.quote('Meu uso não esta mais trancado, todos podem me usar.')
                        } else {
                            guilddb.lock = true
                            guilddb.save()
                            message.quote('Meu uso foi trancado, somente staffs podem me usar.')
                        }
                        break;
        
                    case 'ban':
                        const membro = message.mentions.users.first() ? message.mentions.users.first() : client.users.cache.get(args[1])
                        if(!membro) return message.quote('Mencione ou coloque o ID de um membro.')
                        if(membro.id === client.user.id) return message.quote('Você não pode me banir.')
                        if(membro.bot) return message.quote('Você não pode banir um bot.')
                        if(message.guild.members.cache.get(membro.id).roles.cache.get(guilddb.staffRole)) return message.quote('Você não pode banir alguem da staff.')
                        if(guilddb.banidos.includes(membro.id)){
                            guilddb.banidos.splice(guilddb.banidos.indexOf(membro.id), 1)
                            guilddb.save()
                            message.quote(`\`${membro.tag}\` desbanido.`)
                        } else {
                            guilddb.banidos.push(membro.id)
                            guilddb.save()
                            message.quote(`\`${membro.tag}\` banido.`)
                        }
                        break;
                }
            }

        } catch (error) {
            client.errorMessage(error, this, message)
        }
    }
}