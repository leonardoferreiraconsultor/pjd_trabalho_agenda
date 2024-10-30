// Importando o módulo path
const path = require('path')

exports.pagina_home = ($req, $res) => {
    $res.render('index')
}

exports.pagina_404 = ($req, $res) => {
    $res.render('404')
}