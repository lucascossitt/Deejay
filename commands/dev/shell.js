const Command = require('../../structures/Command')
const exec = require('child_process').exec

module.exports = class Shell extends Command{
    constructor(client){
        super(client, {
            name: 'shell',
            args: true,
            usage: '(codigo)',
            description: 'Shell',
            aliases: ['sh'],
            enabled: false,
            inVoiceChannel: false,
            sameVoiceChannel: false,
            playing: false,
            ownerOnly: true
        })
    }
    async run(client, message, args){

        if(message.author.id !== client.config.owner) return
        if(!args.join(' ')) return message.quote('Coloque um codigo.')
        exec(args.join(' '), function(error, stdout, stderr){
            message.channel.send(stderr + stdout, { code: 'bash' })
            if(error !== null){
                message.channel.send(`\`${error}\``)
            }
        })
    }
}