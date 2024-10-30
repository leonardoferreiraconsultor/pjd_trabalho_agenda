// Importa o LoginModel
const LoginModel = require('../models/LoginModel')

// Página de login
exports.pagina_login = ($req, $res) => {
    $res.render('login')
}

// Entra no sistema
exports.logar = async function($req, $res) {
    const login = new LoginModel()

    try {
        const usuarioLogin = await login.fazerLogin($req.body)
        if(usuarioLogin === false) {
            // Mostra mensagens de erro para o usuário
            $req.flash('lista_erros', login.getErros())
            // Salva a sessão e redireciona para a página de login
            $req.session.save(() => {
                return $res.redirect('login')
            })
            return
        }
        // Mostra mensagens de sucesso para o usuário
        $req.flash('sucesso', `Bem vindo, ${usuarioLogin.nome}` )
        // Sucesso ao fazer login
        // Cria variável de informações do usuário
        $req.session.usuario = {nome: usuarioLogin.nome, logado: true}
        // Salva a sessão
        $req.session.save(() => {
            return $res.redirect('contatos')
        })
        return
    } catch($error) {
        console.log($error)
        return $res.render('404')
    }
}

// Sai do sistema
exports.logout = function($req, $res) {
    // Finaliza a sessão
    $req.session.destroy()
    $res.locals.usuario = {logado: false}
    // redireciona para a página de login
    $res.redirect('login')
}