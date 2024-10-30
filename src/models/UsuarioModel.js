// Importa o manipulador do MongoDB
const mongoose = require('mongoose')
// Importa classe de Model padrão
const DefaultModel = require('./DefaultModel')

// Criando o Schema
const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    sobrenome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    }
})

//Criando o model
const UsuarioModel = mongoose.model('Usuario', UsuarioSchema)

class Usuario extends DefaultModel {
    constructor() {
        super()
    }

    // Cadastra o Usuario
    async cadastrarUsuario($dados) {
        const dados_validados = this.validacaoUsuario($dados)
        // Caso falhe a validação retorna erro
        if(dados_validados === false) {
            return false
        }
        // Verifica se o usuário existe pelo seu e-mail
        const usuarioExiste = await this.usuarioExistePeloEmail(dados_validados.email)
        // Caso o usuário exista
        if(usuarioExiste !== false) {
            this.erros.push('Este e-mail já foi cadastrado')
        } else {
            // caso o e-mail não seja de um usuário, realiza o cadastro
            const novoUsuario = await UsuarioModel.create(dados_validados)
            return (typeof novoUsuario === 'object') ? novoUsuario : false
        }
        return false
    }

    // Verifica se o usuário existe
    async usuarioExistePeloEmail($email) {
        // Verifica se o e-mail do usuário corresponde ao de um usuário
        const usuarioExiste = await UsuarioModel.findOne({email: $email})
        // Caso exista retorna o usuário
        return (usuarioExiste === null) ? false : usuarioExiste
    }

    // validando os dados
    validacaoUsuario($dados) {
        const nome = this.sanitizaString($dados.nome)
        const sobrenome = this.sanitizaString($dados.sobrenome)
        const email = this.sanitizaEmail($dados.email)
        const senha = this.sanitizaString($dados.senha)

        if(!nome) {
            this.erros.push('Nome é um campo obrigatório')
        }

        if(!sobrenome) {
            this.erros.push('Sobrenome é um campo obrigatório')
        }
        
        if(!email) {
            this.erros.push('E-mail inválido')
        }

        // A senha não pode ter mais de 3 caracteres e menos de 20 caracteres
        if(!senha || senha.length < 3 || senha.length >= 20) {
            this.erros.push('Senha inválida. A senha precisa ter entre 3 e 20 caracteres.')
        }
        // Encriptografa a senha
        const senhaEncriptografada = this.encriptarSenha(senha)

        return (this.erros.length > 0) ? false : {
            nome: nome, sobrenome: sobrenome, email: email, senha: senhaEncriptografada
        }
    }
}

module.exports = Usuario