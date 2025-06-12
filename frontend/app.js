document.addEventListener('DOMContentLoaded', () => {
    // URL da API aponta para o serviço 'backend' na porta 8080,
    // que será acessível pela rede interna do Docker Compose.
    const API_URL = 'http://localhost:8080/produtos';

    const formProduto = document.getElementById('form-produto');
    const nomeProdutoInput = document.getElementById('nome-produto');
    const precoProdutoInput = document.getElementById('preco-produto');
    const listaProdutosContainer = document.getElementById('lista-produtos-container');
    const mensagemFormulario = document.getElementById('mensagem-formulario');
    const mensagemLista = document.getElementById('mensagem-lista');

    function exibirMensagem(elemento, texto, tipo = 'info') {
        elemento.textContent = texto;
        elemento.className = 'mensagem';
        if (tipo === 'sucesso') {
            elemento.classList.add('sucesso');
        } else if (tipo === 'erro') {
            elemento.classList.add('erro');
        }
        setTimeout(() => {
            elemento.textContent = '';
            elemento.className = 'mensagem';
        }, 4000);
    }

    function renderizarProduto(produto) {
        const produtoDiv = document.createElement('div');
        produtoDiv.classList.add('produto-item');
        produtoDiv.setAttribute('data-id', produto.id);

        const nomeEl = document.createElement('h3');
        nomeEl.textContent = produto.nome;

        const precoEl = document.createElement('p');
        precoEl.textContent = `Preço: R$ ${parseFloat(produto.preco).toFixed(2)}`;

        const idEl = document.createElement('p');
        idEl.textContent = `ID: ${produto.id}`;

        produtoDiv.appendChild(nomeEl);
        produtoDiv.appendChild(precoEl);
        produtoDiv.appendChild(idEl);

        return produtoDiv;
    }

    async function carregarProdutos() {
        mensagemLista.textContent = 'Carregando produtos...';
        mensagemLista.className = 'mensagem';
        listaProdutosContainer.innerHTML = '';
        listaProdutosContainer.appendChild(mensagemLista);

        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`Erro na rede: ${response.statusText}`);
            }
            const produtos = await response.json();

            mensagemLista.style.display = 'none';
            if (produtos.length === 0) {
                exibirMensagem(mensagemLista, 'Nenhum produto cadastrado.', 'info');
                mensagemLista.style.display = 'block';
            } else {
                produtos.forEach(produto => {
                    const produtoEl = renderizarProduto(produto);
                    listaProdutosContainer.appendChild(produtoEl);
                });
            }
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            exibirMensagem(mensagemLista, `Erro ao carregar produtos. Verifique se o backend está no ar. (${error.message})`, 'erro');
            mensagemLista.style.display = 'block';
        }
    }

    async function handleAdicionarProduto(event) {
        event.preventDefault();
        const nome = nomeProdutoInput.value.trim();
        const preco = parseFloat(precoProdutoInput.value);

        if (!nome || isNaN(preco) || preco <= 0) {
            exibirMensagem(mensagemFormulario, 'Por favor, preencha um nome e preço válidos.', 'erro');
            return;
        }

        const novoProduto = { nome, preco };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoProduto),
            });

            if (!response.ok) {
                throw new Error(`Erro no servidor: ${response.statusText}`);
            }
            
            exibirMensagem(mensagemFormulario, 'Produto adicionado com sucesso!', 'sucesso');
            formProduto.reset();
            await carregarProdutos();
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
            exibirMensagem(mensagemFormulario, error.message, 'erro');
        }
    }

    if (formProduto) {
        formProduto.addEventListener('submit', handleAdicionarProduto);
    }
    carregarProdutos();
});