const Command = require('../../structures/Command')

module.exports = class Reload extends Command{
    constructor(client){
        super(client, {
            name: 'reload',
            args: true,
            usage: '(categoria) (comando)',
            description: 'Recarregar comando',
            aliases: [],
            enabled: false,
            inVoiceChannel: false,
            sameVoiceChannel: false,
            playing: false,
            ownerOnly: true
        })
    }
    async run(client, message, args){

        if(message.author.id !== client.config.owner) return
        if(!args[0]) return message.quote('Coloque uma categoria.')
        if(!args[1]) return message.quote('Coloque um comando.')

        const commandName = args[1].toLowerCase()
        const command = client.commands.get(commandName) || client.commands.find(a => a.aliases && a.aliases.includes(commandName))
        if(!command) return message.quote('Não existe nenhum comando com este nome ou alias.')

        delete require.cache[require.resolve(`../${args[0]}/${commandName}.js`)]

        try {
            const newCommand = require(`../${args[0]}/${commandName}.js`)
            client.commands.set(newCommand.name, newCommand)
        } catch (error) {
            client.channels.cache.get(client.config.errorChannel).send(`Erro ao recarregar comando \`${commandName}\`\n\`\`\`JS\n${error.stack}\`\`\``)
        }
        message.quote('Comando reiniciado.')

    }
}