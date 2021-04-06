const { Structures, APIMessage } = require("discord.js");

const quotes = ['"', "'", "“”", "‘’"];

const flagRegex = new RegExp(`(?:--|—)(\\w[\\w-]+)(?:=(?:${quotes.map((qu) => `[${qu}]((?:[^${qu}\\\\]|\\\\.)*)[${qu}]`).join("|")}|([\\w<>@#&!-]+)))?`, "g");

function getFlags(content, delim) {
    const flags = {};
    content = content.replace(flagRegex, (match, fl, ...quote) => {
        flags[fl] = quote.slice(0, -2).find((el) => el)
            ? quote
                  .slice(0, -2)
                  .find((el) => el)
                  .replace(/\\/g, "")
            : true;
        return "";
    });
    if (delim) content = content.replace(new RegExp(`(${delim})(?:${delim})+`), "$1").trim();
    return {
        content,
        flags
    };
}

module.exports = Structures.extend("Message", (_Message) => {
    class Message extends _Message {
        constructor(...args) {
            super(...args);

            this._setup(this.content);
        }

        _setup(original) {
            let { content, flags } = getFlags(original, " ");
            super.content = content;
            this.flagArgs = flags;
        }
        async quote(content, options) {
            const mentionRepliedUser = typeof ((options || content || {}).allowedMentions || {}).repliedUser === "undefined" ? true : ((options || content).allowedMentions).repliedUser;
            delete ((options || content || {}).allowedMentions || {}).repliedUser;
    
            const apiMessage = content instanceof APIMessage ? content.resolveData() : APIMessage.create(this.channel, content, options).resolveData();
            Object.assign(apiMessage.data, { message_reference: { message_id: this.id } });
        
            if (!apiMessage.data.allowed_mentions || Object.keys(apiMessage.data.allowed_mentions).length === 0)
                apiMessage.data.allowed_mentions = { parse: ["users", "roles", "everyone"] };
            if (typeof apiMessage.data.allowed_mentions.replied_user === "undefined")
                Object.assign(apiMessage.data.allowed_mentions, { replied_user: mentionRepliedUser });
    
            if (Array.isArray(apiMessage.data.content)) {
                return Promise.all(apiMessage.split().map(x => {
                    x.data.allowed_mentions = apiMessage.data.allowed_mentions;
                    return x;
                }).map(this.inlineReply.bind(this)));
            }
    
            const { data, files } = await apiMessage.resolveFiles();
            return this.client.api.channels[this.channel.id].messages
                .post({ data, files })
                .then(d => this.client.actions.MessageCreate.handle(d).message);
        }
    }
    return Message;
});