// Executa em todas as rotas do nosso código
exports.middlewareGlobal = ($req, $res, $next) => {
    // Título da página
    $res.locals.title = 'Minha Agenda'
    // Inicializa variável usuário 
    $res.locals.usuario = ($req.session.usuario) ? $req.session.usuario : {logado: false}
    // Erros de formulário
    $res.locals.erros = $req.flash('lista_erros')
    // Sucesso ao enviar o formulário
    $res.locals.sucesso = $req.flash('sucesso')
    
    $next()
}

// verifica se o usuário está logado para permitir acessar as páginas do sistema
exports.estaLogado = ($req, $res, $next) => {
    if($res.locals.usuario.logado === false) {
        $req.session.save(() => {
            $req.flash('lista_erros', 'Faça login para visualizar a página')
            $res.redirect('/login')
        })
        return
    }
    $next()
}

// verifica se o usuário não está logado para permitir acessar as páginas de fora do sistema
exports.naoEstaLogado = ($req, $res, $next) => {
    if($res.locals.usuario.logado === true) {
        $req.session.save(() => {            
            $res.redirect('/contatos')
        })
        return
    }
    $next()
}

// Envia o token para todas as páginas
exports.CSRFTokenApply = ($req, $res, $next) => {
    // chama a função csrfToken do módulo CSURF
    $res.locals.CSRFToken = $req.csrfToken()
    $next()
}
