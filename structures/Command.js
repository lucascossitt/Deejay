module.exports = class Command {
    constructor(client, options) {
        this.client = client
        this.name = options.name
        this.args = options.args || false
        this.usage = options.usage || ''
        this.description = options.description || 'Nenhuma descrição'
        this.aliases = options.aliases || 'Nenhum'
        this.enabled = options.enabled || true
        this.inVoiceChannel = options.inVoiceChannel || false
        this.sameVoiceChannel = options.sameVoiceChannel || false
        this.playing = options.playing || false
        this.ownerOnly = options.ownerOnly || false
    }
}