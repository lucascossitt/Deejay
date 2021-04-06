var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Guild = new Schema({
    _id: {
        type: String
    },
    lock: {
        type: Boolean,
        default: false
    },
    banidos: {
        type: Array,
        default: []
    },
    canaisBloqueados: {
        type: Array,
        default: []
    },
    djRole: {
        type: String,
        default: 'nenhum'
    },
    staffRole: {
        type: String,
        default: 'nenhum'
    }
})
var Config = new Schema({
    _id: {
        type: String
    },
    manu: {
        type: Boolean,
        default: false
    },
    guildsLiberadas: {
        type: Array,
        default: []
    }
})
var User = new Schema({
    _id: {
        type: String
    },
    favoritos: {
        type: Array,
        default: []
    }
})

var Guilds = new mongoose.model('Guilds', Guild)
var Configs = new mongoose.model('Configs', Config)
var Users = new mongoose.model('Users', User)
exports.Guilds = Guilds
exports.Configs = Configs
exports.Users = Users