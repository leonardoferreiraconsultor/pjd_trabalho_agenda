// Importa o manipulador do MongoDB
const mongoose = require('mongoose')

// Criando um Schema
const HomeSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    }
})

//Criando um model
const HomeModel = mongoose.model('Home', HomeSchema)

module.exports = HomeModel