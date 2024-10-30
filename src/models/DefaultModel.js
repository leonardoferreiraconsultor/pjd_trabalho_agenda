// Importa o pacote validator
const validator = require('validator')
// Importa o pacote bcryptjs
const bcryptjs = require('bcryptjs')
// Importa o pacote moment-timezone 
const moment = require('moment-timezone')

class DefaultModel {
    constructor() {
        // erros armazena os possíveis erros e impede o usuário de ser cadastrado
        this.erros = []
        
    }

    // Sanitiza uma string
    sanitizaString($string) {
        if(typeof $string === 'string') {
            // Substitui os caracteres <, >, &, ', "e /por entidades HTML.
            $string = validator.escape($string)
            // Remove espaços no início e fim da string
            return $string.trim()
        }
        return null
    }
    // retorna um valor string em formato HTML
    unescapeString($string) {
        return validator.unescape($string)
    }
    // Sanitiza um e-mail
    sanitizaEmail($email) {
        if(typeof $email === 'string' && validator.isEmail($email)) {
            return $email
        }
        return null
    }

    // Sanitiza uma data
    sanitizaData($data, $format = 'DD/MM/YYYY') {
        // Valida data no formato passado pela opção format
        if(typeof $data === 'string' && validator.isDate($data, {format: $format})) {
            return $data
        }
        return null
    }

    // Sanitiza um número de telefone
    sanitizaTelefone($telefone) {
        if(typeof $telefone === 'string' && validator.isMobilePhone($telefone, 'pt-BR')) {
            return $telefone
        }
        return null
    }

    // Cria um hash para a senha
    // Diferente da criptografia convencional, um hash não pode ser descriptografado
    encriptarSenha($senha) {
        // Gera um salt = dado aleatório que é usado para proteger senhas
        const salt = bcryptjs.genSaltSync()
        // Encripta a senha
        return bcryptjs.hashSync($senha, salt)
    }

    // Verifica se o hash da senha é igual ao hash da senha do usuário
    verificaSenha($senha, $senhaBD) {
        return bcryptjs.compareSync($senha, $senhaBD)
    }

    // Converte de uma string com uma data para um novo formato
    converteDataISO($dataString) {
        // divide a data em 3 inteiros: dia, mês e ano
        let [dia, mes, ano] = $dataString.split(/[\/ :]/).map(v => parseInt(v))
        // Cria um formato de data válido
        const dateObj = new Date(Date.UTC(ano, mes - 1, dia, 0, 0, 0))
        // Converte a data no formato ISO 8601 => YYYY-MM-DD
        return dateObj.toISOString()
    }

    // Converte data do padrão do Banco de Dados para o padrão brasileiro
    converteDataBR($dataString) {
        const dateObj = new Date($dataString)
        // O parâmetro GTM retorna a data com a data zerada no padrão Greenwich
        const momentObj = moment.tz(dateObj, 'YYYY-MM-DD', 'GTM')
        return momentObj.format('DD/MM/YYYY')
    }

    getErros() {
        return this.erros
    }
}

module.exports = DefaultModel