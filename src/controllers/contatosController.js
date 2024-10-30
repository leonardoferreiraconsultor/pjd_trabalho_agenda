// Importa o ContatoModel
const ContatoModel = require('../models/ContatoModel')

// Página de listagem de contatos
exports.lista_contatos = async ($req, $res) => {
    // Instancia ContatoModel
    const Contato = new ContatoModel()
    try {
        // Obtem a lista de contatos
        const contatos = await Contato.listarContatos()
        
        $res.render('lista_contatos', {contatos})
    } catch($error) {
        // Imprime o erro no terminal
        console.error($error)
        // Salva a sessão e redireciona para a página de erro 404
        $req.session.save(() => {
            return $res.redirect('/404')
        })
    }
}

// Página do formulário de cadastro de contatos
exports.cadastro_contatos = ($req, $res) => {
    $res.render('form_contatos', {contato: {}})
}

// Cadastro de contatos
exports.cadastrar_contatos = async function($req, $res) {
    // Instancia ContatoModel
    const Contato = new ContatoModel()
    try {
        const novoContato = await Contato.cadastrarContato($req.body)

        if(novoContato === false) {
            // Mostra mensagens de erro para o contato
            $req.flash('lista_erros', Contato.getErros())
            // Salva a sessão e redireciona para a página de listagem de contatos
            $req.session.save(() => {
                // Redirecionada para a lista de contatos
                return $res.redirect('/contatos/cadastro')
            })
            return
        }
        // Mostra mensagens de sucesso para o usuário
        $req.flash('sucesso', 'Contato cadastrado com sucesso!')
        // Sucesso ao criar o usuário
        $req.session.save(() => {
            // Redirecionada para a lista de contatos
            return $res.redirect('/contatos')
        })
        return
    } catch($error) {
        // Imprime o erro no terminal
        console.error($error)
        // Salva a sessão e redireciona para a página de erro 404
        $req.session.save(() => {
            return $res.redirect('/404')
        })
    }
}

// Página do formulário de edição de contatos
exports.edicao_contatos = async ($req, $res) => {
    // Parâmetro ID
    const id = $req.params.id
    // Instancia ContatoModel
    const Contato = new ContatoModel()
    try {
        // Caso ID não seja um número gera um erro
        if(id === undefined) {
            throw new Error('O ID não é um número válido!')
        }
        const contato = await Contato.obterContatoPeloID(id)
        if(contato === null) {
            throw new Error('Erro ao obter os dados do contato!')
        }
        $res.render('form_contatos', {contato} )
    } catch($error) {
        // Imprime o erro no terminal
        console.error($error)
        // Salva a sessão e redireciona para a página de erro 404
        $req.session.save(() => {
            return $res.redirect('/404')
        })
    }
}

// Edição de contatos
exports.editar_contatos = async function($req, $res) {
    // Instancia ContatoModel
    const Contato = new ContatoModel()
    try {
        const contato = await Contato.editarContato($req.body)

        if(contato === false) {
            // Mostra mensagens de erro para o contato
            $req.flash('lista_erros', Contato.getErros())
            // Salva a sessão e redireciona para a página de listagem de contatos
            $req.session.save(() => {
                return $res.redirect('/contatos/edicao')
            })
            return
        }
        // Mostra mensagens de sucesso para o usuário
        $req.flash('sucesso', 'Contato editado com sucesso!')
        // Sucesso ao criar o usuário
        $req.session.save(() => {
            // Redirecionada para a lista de contatos
            return $res.redirect('/contatos')
        })
        return
    } catch($error) {
        console.log($error)
        $req.session.save(() => {
            return $res.redirect('/404')
        })
    }
}

// Excluir contato
exports.excluir_contatos = async function($req, $res) {
    // Parâmetro ID
    const id = $req.body.id
    // Instancia ContatoModel
    const Contato = new ContatoModel()
    try {
        // Caso ID não seja um número gera um erro
        if(id === undefined) {
            throw new Error('O ID não é um número válido.')
        }
        // Excluir contato
        const contato = await Contato.excluirContato(id)
        // retorna o objeto em formato JSON
        $res.json({status: true, dados: contato})
    } catch($error) {
        $req.session.save()
        $res.json({status: false, dados: {erro: $error}})
    }
}