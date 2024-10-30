// Importantando o Framework Express
const express = require('express')
// Cria as rotas da aplicação
const route = express.Router()
// Importando os middlewares para verificação do login
const {estaLogado, naoEstaLogado} = require('./src/middlewares/middleware')

// Importando o controller da home
const homeController = require('./src/controllers/homeController')

// Cria a rota para a Home
route.get('/', homeController.pagina_home)
// Cria a rota para a página 404
route.get('/404', homeController.pagina_404)

// Importando o controller da página de login
const loginController = require('./src/controllers/loginController')

// Cria a rota para a página de login
route.get('/login', naoEstaLogado, loginController.pagina_login)
// Cria a rota para logar
route.post('/logar', naoEstaLogado, loginController.logar)
// Cria a rota para logar
route.get('/logout', loginController.logout)

// Importando o controller da página de cadastro
const cadastroController = require('./src/controllers/cadastroController')

// Cria a rota para a página de login
route.get('/cadastro', naoEstaLogado, cadastroController.pagina_cadastro)
// Cria a rota para logar
route.post('/cadastrar', naoEstaLogado, cadastroController.cadastrar)

// Importando o controller da página de login
const contatosController = require('./src/controllers/contatosController')

// Cria a rota para a página listagem de contatos
route.get('/contatos', estaLogado, contatosController.lista_contatos)
// Cria a rota para a página de cadastro de contatos
route.get('/contatos/cadastro', estaLogado, contatosController.cadastro_contatos)
// Cria a rota para cadastrar um contato
route.post('/contatos/cadastrar', estaLogado, contatosController.cadastrar_contatos)
// Cria a rota para a página de edição de contatos
route.get('/contatos/edicao/:id', estaLogado, contatosController.edicao_contatos)
// Cria a rota para editar um contato
route.post('/contatos/editar', estaLogado, contatosController.editar_contatos)
// Cria a rota para excluir um contato
route.post('/contatos/excluir', estaLogado, contatosController.excluir_contatos)

// Outras páginas sem rota definida
route.use(($req, $res, $next) => {
    $res.status(404).redirect('/404')
    $next()
})

// Exportando todas as rotas
module.exports = route