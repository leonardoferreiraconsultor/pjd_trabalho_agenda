// Importantando o Framework Express
const express = require('express')
// Cria uma aplicação express
const app = express()

// Importando o módulo dotenv
require('dotenv').config()
// Importando o módulo path
const path = require('path')
// Importando o módulo helmet
//const helmet = require('helmet')
// Importando o módulo csurf
const csurf = require('csurf')

// Importa o manipulador do MongoDB
const mongoose = require('mongoose')
// Conectando com minha base de dados MongoDB
mongoose.connect(process.env.CONNECTIONSTRING)
	.then(() => {
		console.log('Conexão com a base de dados foi estabelecida!')
		// Gera um evento ao concluir a conexão 
		app.emit('connected')
	})
	.catch($error => console.log($error))

// Importa o pacote de manipulação de sessão do express
const session = require('express-session')
// Importa o pacote connect-mongo e passa o session para o seu construtor
// Salva a sessão na base de dados, evitando que a mesma fique ocupando a memória
const MongoStore = require('connect-mongo')
// Importa o pacote express-flash
const flash = require('express-flash')

// Analisa os dados recebidos via método POST e preenche o objeto com pares chave-valor
app.use(express.urlencoded({extended: false}))
// Permite que o express receba JSON
app.use(express.json());
// Define a localização de arquivos 
app.use(express.static(path.resolve(__dirname,'public')))
// Utilizando Helmet
//app.use(helmet())

// Configurações da sessão
const sessionOptions = session({
	secret: 'kdvuopaSMNWPEPBDFKSPDPVBC93OP34=GDGSPSAD03P32MFPDSOWEO4KMSADLE',
	store: MongoStore.create({mongoUrl: process.env.CONNECTIONSTRING}),
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 *7,
		httpOnly: true
	}
})
app.use(sessionOptions)
app.use(flash())

// Caminho para a pasta views
app.set('views', path.resolve(__dirname, 'src', 'views'))
// Definindo nossa view engine
app.set('view engine', 'ejs')

// Utilizando o CSURF
app.use(csurf())

// Middleware global e middlewares do CSURF
// O segundo middleware injeta o token do CSURF em todas as páginas
// O terceiro verifica se não existe nenhum erro de CSRF e para a execução do código
const { middlewareGlobal, CSRFTokenApply } = require('./src/middlewares/middleware')
app.use(middlewareGlobal)
app.use(CSRFTokenApply)

// Importando as rotas
const routes = require('./routes')
// Usando as rotas
app.use(routes)

// Somente roda a aplicação quando conectado a base de dados
app.on('connected', () => {
    // Servidor ouvindo na porta 3000
	app.listen(3000, () => {
	    console.log('Servidor está executando em http://localhost:3000.')
	})
})