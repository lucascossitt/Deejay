const { Structures } = require('discord.js')
Structures.extend('Guild', _Guild => {
  class Guild extends _Guild {
    constructor (...data) {
      super(...data)
    }

    get player () {
      return this.client.music.players.get(this.id) || null
    }
  }
  return Guild
})