const Event = require('../../structures/Event')

module.exports = class messageUpdate extends Event{
    constructor(...args){
        super(...args)
    }

    async run(oldMessage, newMessage){
        if(oldMessage.content !== newMessage.content){
            newMessage._setup(newMessage.content)
            this.client.emit("message", newMessage)
        }
    }
}