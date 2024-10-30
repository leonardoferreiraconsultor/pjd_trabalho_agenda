// Importa o manipulador do MongoDB
const mongoose = require('mongoose')
// Importa classe de Model padrão
const DefaultModel = require('./DefaultModel')

// Criando o Schema
const ContatoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    sobrenome: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    data_de_nascimento: {
        type: Date,
        required: false
    },
    telefone: {
        type: String,
        required: true
    },
    criado_em: {
        type: Date,
        default: Date.now
    }
})

//Criando o model
const ContatoModel = mongoose.model('Contato', ContatoSchema)

class Contato extends DefaultModel {        
    constructor() {
        // Construtor de DefaultModel
        super()
    }

    // Listar contatos
    async listarContatos() {
        // Retorna todos os contatos
        // Com o método sort, retorna na ordem decrescente (-1) pela Data de criação
        const contatos = await ContatoModel.find().sort({criado_em: -1})
        if(contatos === null) {
            this.erros.push('Erro ao listar os contatos')
            return false
        }
        return contatos
    }

    // Cadastra o Contato
    async cadastrarContato($dados) {
        const dados_validados = this.validacaoContato($dados)
        // Caso os dados estejam corretos, realiza o cadastro
        if(dados_validados !== false) {
            const novoContato = await ContatoModel.create(dados_validados)
            return (typeof novoContato === 'object') ? novoContato : false
        }
        return false
    }

    // Editar o Contato
    async editarContato($dados) {
        const id = ($dados.id) ? this.sanitizaString($dados.id) : null
        const dados_validados = this.validacaoContato($dados)
        // Caso os dados estejam corretos, realiza a edição
        if(id !== null && dados_validados !== false) {
            const contato = await ContatoModel.findByIdAndUpdate(id, dados_validados, {new: true})
            return (typeof contato === 'object') ? contato : false
        }
        return false
    }

    // Editar o Contato
    async excluirContato($id) {
        const id = ($id) ? this.sanitizaString($id) : null
        const contato = id && await ContatoModel.findByIdAndDelete(id)
        if(typeof contato !== 'object') {
            throw new Error('Erro ao excluir o contato!')
        }
        return contato
    }

    // Obter dados de um contato pelo seu ID
    async obterContatoPeloID($id) {
        const contato = await ContatoModel.findById($id)
        // Formata os valores de entrada
        if(contato !== null) {
            const novoContato = {
                id: $id,
                nome: this.unescapeString(contato.nome),
                sobrenome: this.unescapeString(contato.sobrenome),
                email: contato.email,
                telefone: contato.telefone,
                data_de_nascimento: this.converteDataBR(contato.data_de_nascimento)
            }
            return novoContato
        }
        return null
    }

    // validando os dados
    validacaoContato($dados) {
        const nome = this.sanitizaString($dados.nome)
        const sobrenome = this.sanitizaString($dados.sobrenome)
        const email = this.sanitizaEmail($dados.email)
        const data_de_nascimento = this.sanitizaData($dados.data_de_nascimento)
        const telefone = this.sanitizaTelefone($dados.telefone)

        if(!nome) {
            this.erros.push('Nome é um campo obrigatório')
        }

        if(!email) {
            this.erros.push('E-mail inválido')
        }

        if(!data_de_nascimento) {
            this.erros.push('Data de nascimento inválida')
        }

        if(!telefone) {
            this.erros.push('Telefone inválido')
        }

        const novaData_de_nascimento = (data_de_nascimento !== null) ? this.converteDataISO(data_de_nascimento) : null

        return (this.erros.length > 0) ? false : {
            nome: nome, sobrenome: sobrenome, email: email, 
            data_de_nascimento: novaData_de_nascimento, telefone: telefone
        }
    }
}

module.exports = Contato