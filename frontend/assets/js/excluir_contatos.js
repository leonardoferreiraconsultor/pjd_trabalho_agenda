(() => {
    /**
     * Cria mensagem de erro e imprime na tela
     */
    const mostrar_mensagem = ($mensagem, $tipo_da_mensagem) => {
        const container = document.querySelector('main > div > div')
        // Remove mensagem, caso exista
        const msg = container.querySelector('#mensagem')
        if(msg) {
            msg.remove()
        }
        container.insertAdjacentHTML('afterbegin', 
            `<div id="mensagem" class="row"><div class="col"><ul class="alert alert-${$tipo_da_mensagem}"><li>${$mensagem}</li></ul></div></div>`)
    }

    /**
     * Verifica se o usuário quer mesmo excluir o contato
     */
    const excluir_contato = async ($url, $dados) => {
        // Utiliza fetch para fazer uma chamada assincrona
        const resposta = await fetch($url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify($dados)
        })
        if(resposta.status !== 200)
            throw new Error('Atenção: Erro 404')

        const respostaJSON = await resposta.json()
        // verifica resposta
        if(!respostaJSON.hasOwnProperty('status') || !respostaJSON.hasOwnProperty('dados')) {
            throw new Error('Erro ao receber os dados.')
        }        
        return respostaJSON
    }

    /**
     * Formulário de exclusão
     */
    const id_lista_contatos = document.querySelector('#lista_contatos')
    if(id_lista_contatos) {
        id_lista_contatos.addEventListener('submit', async function($evento) {
            const elemento = $evento.target;
            // recebe o nome do elemento clicado
            const tag = elemento.tagName.toLowerCase()  

            if(tag === 'form') {
                // impede que a ação padrão submit seja executada
                $evento.preventDefault()
                // Confirma a exclusão
                const confirmar = window.confirm('Quer realmente excluir este contato?')                    
                if(confirmar === true) {
                    const url = elemento.getAttribute('action')
                    const id = elemento.querySelector('input[name=id]').value
                    const _csrf = elemento.querySelector('input[name=_csrf]').value

                    try {
                        const resposta = await excluir_contato(url, {id, _csrf})

                        if(typeof resposta === 'object') {                            
                            const status = (resposta.hasOwnProperty('status')) ? resposta.status : false
                            const dados = (resposta.hasOwnProperty('dados')) ? resposta.dados : null

                            // Verifica o status da resposta
                            if(status === true) {
                                const nomeCompleto = (dados.hasOwnProperty('nome') && dados.hasOwnProperty('sobrenome')) ? `${dados.nome} ${dados.sobrenome}` : ''
                                // Mostra a mensagem de sucesso
                                mostrar_mensagem(`Contato <strong>${nomeCompleto}</strong> removido com sucesso!`, 'success')
                                // remove linha da tabela do contato excluído
                                elemento.parentNode.parentNode.remove()
                                return
                            }
                            // Mostra mensagem de erro
                            mostrar_mensagem(`Erro ao remover o contato.`, 'danger')
                            return
                        }
                    } catch ($error) {
                        // Mostra mensagem de erro
                        mostrar_mensagem(`Erro ao remover o contato.`, 'danger')
                    }
                }
            }
        })
    }
})()