// Importa o UsuarioModel
const UsuarioModel = require('../models/UsuarioModel')

// Página de cadastro
exports.pagina_cadastro = ($req, $res) => {
    $res.render('cadastro')
}

// Formulário enviado
exports.cadastrar = async function($req, $res) {
    const usuario = new UsuarioModel()

    try {
        const novoUsuario = await usuario.cadastrarUsuario($req.body)
        if(novoUsuario === false) {
            // Mostra mensagens de erro para o usuário
            $req.flash('lista_erros', usuario.getErros())
            // Salva a sessão e redireciona para a página de cadastro
            $req.session.save(() => {
                return $res.redirect('/cadastro')
            })
            return
        }
        // Mostra mensagens de sucesso para o usuário
        $req.flash('sucesso', 'Registro realizado com sucesso!')
        // Sucesso ao criar o usuário        
        // Salva a sessão
        $req.session.save(() => {
            // Cria variável de informações do usuário
            $req.session.usuario = {nome: novoUsuario.nome, logado: true}
            // Salva a sessão e redireciona para a página de contatos
            $req.session.save(() => {
                return $res.redirect('/contatos')
            })
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