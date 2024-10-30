// Importa o manipulador do MongoDB
const mongoose = require('mongoose')
// Importa classe de Model padrão
const DefaultModel = require('./DefaultModel')
// Importa classe UsuarioModel
const UsuarioModel = require('./UsuarioModel')

class Login extends DefaultModel {
    constructor() {
        super()
        // Instancia a classe de UsuarioModel
        this.usuario = new UsuarioModel()
    }

    // registra o login
    async fazerLogin($dados) {
        const dados_validados = this.validacaoLogin($dados)
        // caso os dados estejam corretos, faz o login
        if(dados_validados !== false) {
            // verifica se o usuário existe, caso exista cria a sessão
            return this.usuarioExiste(dados_validados.email, dados_validados.senha)
        }
        return false
    }

    // Verifica se o usuário existe
    async usuarioExiste($email, $senha) {
        const usuario = await this.usuario.usuarioExistePeloEmail($email)
        // Verifica se o e-mail do usuário corresponde à um usuário logado
        if(usuario !== false) {
            // Verifica se a senha está correta
            if(this.verificaSenha($senha, usuario.senha) === true) {
                return usuario
            }            
        }
        this.erros.push('E-mail ou senha inválidos')
        return false
    }

    // validando os dados
    validacaoLogin($dados) {
        const email = this.sanitizaEmail($dados.email)
        const senha = this.sanitizaString($dados.senha)

        if(!email) {
            this.erros.push('E-mail inválido')
        }

        // A senha não pode ter mais de 3 caracteres e menos de 20 caracteres
        if(!senha || senha.length < 3 || senha.length >= 20) {
            this.erros.push('Senha inválida. A senha precisa ter entre 3 e 20 caracteres.')
        }

        return (this.erros.length > 0) ? false : {email, senha}
    }
}

module.exports = Login