const API_BASE_URL = 'https://backendacademia.vercel.app';

// REFERÊNCIAS DO DOM
const loginSection = document.getElementById('loginSection');
const adminSection = document.getElementById('adminSection');
const loginForm = document.getElementById('loginForm');
const btnLogout = document.getElementById('btnLogout');
const loginError = document.getElementById('loginError');

const clienteForm = document.getElementById('clienteForm');
const tabelaCliente = document.getElementById('tabelaCliente');
const totalClienteEl = document.getElementById('totalCliente');
const btnCancelar = document.getElementById('btnCancelar');
const formTitle = document.getElementById('formTitle');

let tokenAtual = localStorage.getItem('adminToken') || null;
let clientes = [];

function iniciarApp() {
    if (tokenAtual) {
        mostrarPainelAdmin();
        carregarClientes();
    } else {
        mostrarLogin();
    }
}

// 1. AUTENTICAÇÃO
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    // Esconder erro anterior
    loginError.classList.add('hidden');

    try {
        const resposta = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: usuario, senha: password })
        });

        if (resposta.ok) {
            const dados = await resposta.json();
            tokenAtual = dados.token;
            localStorage.setItem('adminToken', tokenAtual);
            loginForm.reset();
            mostrarPainelAdmin();
            carregarClientes();
        } else {
            loginError.classList.remove('hidden');
            loginError.textContent = "Usuário ou senha inválidos!";
        }
    } catch (erro) {
        console.error("Erro no login:", erro);
        loginError.classList.remove('hidden');
        loginError.textContent = "Erro ao conectar com o servidor. Tente novamente.";
    }
});

btnLogout.addEventListener('click', () => {
    tokenAtual = null;
    localStorage.removeItem('adminToken');
    mostrarLogin();
});

// 2. CRUD: READ
async function carregarClientes() {
    try {
        const resposta = await fetch(`${API_BASE_URL}/clientes`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${tokenAtual}` }
        });

        if (resposta.ok) {
            clientes = await resposta.json();
            renderizarTabela();
        } else if (resposta.status === 401) {
            // Token expirado ou inválido
            alert("Sua sessão expirou. Faça login novamente.");
            btnLogout.click();
        } else {
            throw new Error("Erro ao carregar clientes");
        }
    } catch (erro) {
        console.error("Erro ao carregar clientes:", erro);
        alert("Não foi possível carregar a lista de clientes.");
    }
}

// Função alternativa para alternar status (com mais debug)
async function alternarStatus(cpf, statusAtual) {
    console.log("=== ALTERNAR STATUS ===");
    console.log("CPF recebido:", cpf);
    console.log("Status atual:", statusAtual);
    console.log("Tipo do status atual:", typeof statusAtual);

    const novoStatus = !statusAtual;
    console.log("Novo status será:", novoStatus);

    // Verificar se o token existe
    if (!tokenAtual) {
        console.error("Token não encontrado!");
        mostrarNotificacao("Sessão expirada. Faça login novamente.", 'error');
        btnLogout.click();
        return;
    }

    console.log("Token atual:", tokenAtual.substring(0, 20) + "...");

    // Mostrar loading no botão
    const botoes = document.querySelectorAll(`button[onclick*="alternarStatus('${cpf}'"]`);
    let botaoClicado = null;
    botoes.forEach(btn => {
        if (btn.textContent.includes('Bloquear') || btn.textContent.includes('Liberar')) {
            botaoClicado = btn;
        }
    });

    if (botaoClicado) {
        const textoOriginal = botaoClicado.innerHTML;
        botaoClicado.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Aguarde...';
        botaoClicado.disabled = true;
    }

    try {
        // Opção 1: Tentar com PATCH (como estava)
        console.log("Tentando requisição PATCH para:", `${API_BASE_URL}/clientes/${cpf}`);

        const resposta = await fetch(`${API_BASE_URL}/clientes/${cpf}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAtual}`
            },
            body: JSON.stringify({ status: novoStatus })
        });

        console.log("Status da resposta:", resposta.status);
        console.log("Headers da resposta:", resposta.headers);

        const respostaTexto = await resposta.text();
        console.log("Resposta completa (texto):", respostaTexto);

        let respostaJson = null;
        try {
            respostaJson = JSON.parse(respostaTexto);
            console.log("Resposta JSON:", respostaJson);
        } catch (e) {
            console.log("Resposta não é JSON válido");
        }

        if (resposta.ok) {
            console.log("✅ Status alterado com sucesso!");
            mostrarNotificacao(novoStatus ? "Cliente liberado com sucesso!" : "Cliente bloqueado com sucesso!", 'success');
            await carregarClientes(); // Recarrega a lista
        } else {
            console.error("❌ Falha na requisição:", resposta.status);

            // Tentar com PUT como fallback
            console.log("Tentando com PUT como fallback...");
            const respostaPut = await fetch(`${API_BASE_URL}/clientes/${cpf}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenAtual}`
                },
                body: JSON.stringify({ status: novoStatus })
            });

            if (respostaPut.ok) {
                console.log("✅ PUT funcionou!");
                mostrarNotificacao(novoStatus ? "Cliente liberado com sucesso!" : "Cliente bloqueado com sucesso!", 'success');
                await carregarClientes();
            } else {
                const erroPut = await respostaPut.text();
                console.error("PUT também falhou:", erroPut);
                throw new Error(`Erro ${resposta.status}: ${respostaTexto || erroPut}`);
            }
        }
    } catch (erro) {
        console.error("❌ Erro detalhado:", erro);
        console.error("Stack trace:", erro.stack);

        // Mensagem de erro mais específica
        let mensagemErro = "Erro ao alterar status do aluno.";
        if (erro.message.includes("Failed to fetch")) {
            mensagemErro = "Erro de conexão com o servidor. Verifique sua internet.";
        } else if (erro.message.includes("401")) {
            mensagemErro = "Sessão expirada. Faça login novamente.";
            btnLogout.click();
        } else if (erro.message.includes("404")) {
            mensagemErro = "Cliente não encontrado no sistema.";
        }

        mostrarNotificacao(mensagemErro, 'error');
    } finally {
        if (botaoClicado) {
            botaoClicado.disabled = false;
            const textoRestaurado = novoStatus ?
                '<i class="fas fa-ban"></i> Bloquear' :
                '<i class="fas fa-check-circle"></i> Liberar';
            botaoClicado.innerHTML = textoRestaurado;
        }
    }
}

// Função auxiliar para mostrar notificações
function mostrarNotificacao(mensagem, tipo = 'info') {
    const cores = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };

    const notificacao = document.createElement('div');
    notificacao.className = `fixed top-20 right-4 ${cores[tipo]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300`;
    notificacao.innerHTML = `
        <div class="flex items-center gap-2">
            <i class="fas ${tipo === 'success' ? 'fa-check-circle' : tipo === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${mensagem}</span>
        </div>
    `;

    document.body.appendChild(notificacao);

    setTimeout(() => {
        notificacao.style.opacity = '0';
        setTimeout(() => notificacao.remove(), 300);
    }, 3000);
}

// Função principal para renderizar a tabela
// ... (mantenha o início do código igual até a função renderizarTabela) ...

function renderizarTabela() {
    if (!tabelaCliente) return;

    tabelaCliente.innerHTML = '';
    totalClienteEl.textContent = clientes.length;

    if (clientes.length === 0) {
        tabelaCliente.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-12 text-center text-zinc-600 uppercase text-[10px] font-bold tracking-widest">
                    Nenhum atleta na base de dados
                </td>
            </tr>`;
        return;
    }

    clientes.forEach(c => {
        const statusTexto = c.status ? 'ATIVO' : 'PENDENTE';
        // Cores do status no estilo minimalista
        const statusCor = c.status ? 'text-green-500' : 'text-red-500';
        const botaoStatusTexto = c.status ? 'BLOQUEAR' : 'LIBERAR';
        const botaoStatusIcon = c.status ? 'fa-ban' : 'fa-check-circle';

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-zinc-900/30 transition-colors group';
        tr.innerHTML = `
            <td class="px-6 py-4 text-xs font-black text-white uppercase">${escapeHtml(c.nome)}</td>
            <td class="px-6 py-4 text-xs font-mono text-zinc-500">${formatarCPF(c.cpf)}</td>
            <td class="px-6 py-4">
                <span class="text-[10px] font-black uppercase tracking-tighter ${statusCor}">
                    <i class="fas ${c.status ? 'fa-circle' : 'fa-exclamation-triangle'} mr-1 text-[8px]"></i>
                    ${statusTexto}
                </span>
            </td>
            <td class="px-6 py-4 text-right whitespace-nowrap">
                <div class="flex justify-end gap-4 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button onclick="alternarStatus('${c.cpf}', ${c.status})" 
                        class="text-[10px] font-black uppercase text-zinc-400 hover:text-white transition-colors">
                        <i class="fas ${botaoStatusIcon} mr-1"></i> ${botaoStatusTexto}
                    </button>
                    <button onclick="editarCliente('${c.cpf}')" 
                        class="text-[10px] font-black uppercase text-zinc-400 hover:text-smart-yellow transition-colors">
                        <i class="fas fa-edit mr-1"></i> Editar
                    </button>
                    <button onclick="deletarCliente('${c.cpf}')" 
                        class="text-[10px] font-black uppercase text-zinc-400 hover:text-red-600 transition-colors">
                        <i class="fas fa-trash-alt mr-1"></i>
                    </button>
                </div>
            </td>
        `;
        tabelaCliente.appendChild(tr);
    });
}

// ... (as demais funções de CRUD permanecem as mesmas, apenas garanta que as notificações usem o novo estilo) ...

function mostrarNotificacao(mensagem, tipo = 'info') {
    const cores = {
        success: 'border-green-500 bg-black',
        error: 'border-red-500 bg-black',
        info: 'border-smart-yellow bg-black'
    };

    const notificacao = document.createElement('div');
    notificacao.className = `fixed top-6 right-6 border-l-4 ${cores[tipo]} text-white px-6 py-4 shadow-2xl z-50 transition-all duration-300`;
    notificacao.innerHTML = `
        <div class="flex items-center gap-4">
            <span class="text-[10px] font-black uppercase tracking-widest">${mensagem}</span>
        </div>
    `;

    document.body.appendChild(notificacao);

    setTimeout(() => {
        notificacao.style.opacity = '0';
        notificacao.style.transform = 'translateX(20px)';
        setTimeout(() => notificacao.remove(), 300);
    }, 3000);
}
// Função para formatar CPF
function formatarCPF(cpf) {
    const cpfStr = String(cpf).padStart(11, '0');
    return cpfStr.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Função para escapar HTML e prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 3. CRUD: CREATE e UPDATE
clienteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cpfOriginal = document.getElementById('clientescpf').value;
    const nome = document.getElementById('nome').value.trim();
    let novoCpf = document.getElementById('cpf').value.trim();

    // Validações
    if (!nome) {
        mostrarNotificacao("Por favor, informe o nome do cliente.", 'error');
        return;
    }

    if (!novoCpf) {
        mostrarNotificacao("Por favor, informe o CPF do cliente.", 'error');
        return;
    }

    if (novoCpf.length !== 11) {
        mostrarNotificacao("CPF deve ter 11 dígitos.", 'error');
        return;
    }

    // Verificar se CPF já existe (apenas para novo cadastro)
    if (!cpfOriginal) {
        const cpfExiste = clientes.some(c => String(c.cpf) === novoCpf);
        if (cpfExiste) {
            mostrarNotificacao("Já existe um cliente com este CPF.", 'error');
            return;
        }
    }

    const clienteData = { nome: nome, cpf: novoCpf };

    try {
        const url = cpfOriginal ? `${API_BASE_URL}/clientes/${cpfOriginal}` : `${API_BASE_URL}/clientes`;
        const metodoHTTP = cpfOriginal ? 'PATCH' : 'POST';

        const respostaApi = await fetch(url, {
            method: metodoHTTP,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAtual}`
            },
            body: JSON.stringify(clienteData)
        });

        if (respostaApi.ok) {
            mostrarNotificacao(cpfOriginal ? "Cliente atualizado com sucesso!" : "Cliente cadastrado com sucesso!", 'success');
            limparFormulario();
            await carregarClientes();
        } else {
            const erro = await respostaApi.json();
            mostrarNotificacao(erro.error || "Falha ao salvar cliente.", 'error');
        }
    } catch (erro) {
        console.error("Erro na requisição:", erro);
        mostrarNotificacao("Erro ao conectar com o servidor.", 'error');
    }
});

function editarCliente(cpf) {
    const c = clientes.find(item => String(item.cpf) === String(cpf));
    if (c) {
        document.getElementById('clientescpf').value = c.cpf;
        document.getElementById('nome').value = c.nome;
        document.getElementById('cpf').value = c.cpf;

        formTitle.textContent = "Editar Cliente";
        btnCancelar.classList.remove('hidden');

        // Scroll para o formulário
        document.querySelector('.sticky').scrollIntoView({ behavior: 'smooth' });
    }
}

async function deletarCliente(cpf) {
    const cliente = clientes.find(c => String(c.cpf) === String(cpf));

    if (!confirm(`Tem certeza que deseja excluir o cliente "${cliente?.nome}"? Esta ação não pode ser desfeita.`)) {
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/clientes/${cpf}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${tokenAtual}` }
        });

        if (res.ok) {
            mostrarNotificacao("Cliente excluído com sucesso!", 'success');
            await carregarClientes();
        } else {
            const erro = await res.json();
            throw new Error(erro.error || "Erro ao excluir");
        }
    } catch (erro) {
        console.error("Erro ao excluir:", erro);
        mostrarNotificacao(erro.message || "Erro ao excluir cliente.", 'error');
    }
}

function limparFormulario() {
    clienteForm.reset();
    document.getElementById('clientescpf').value = '';
    formTitle.textContent = "Novo Cliente";
    btnCancelar.classList.add('hidden');
}

btnCancelar.addEventListener('click', limparFormulario);

// Busca de clientes
const inputBusca = document.getElementById('buscaNome');

function filtrarClientes(termoBusca) {
    if (!termoBusca) {
        renderizarTabela();
        return;
    }

    const termo = termoBusca.toLowerCase();
    const clientesFiltrados = clientes.filter(c =>
        c.nome.toLowerCase().includes(termo) ||
        String(c.cpf).includes(termo)
    );

    renderizarTabelaFiltrada(clientesFiltrados);
}

inputBusca.addEventListener('input', (e) => {
    filtrarClientes(e.target.value);
});

function renderizarTabelaFiltrada(listaParaExibir) {
    if (!tabelaCliente) return;

    tabelaCliente.innerHTML = '';
    totalClienteEl.textContent = listaParaExibir.length;

    if (listaParaExibir.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                <i class="fas fa-search text-4xl mb-2 block"></i>
                Nenhum cliente encontrado
            </td>
        `;
        tabelaCliente.appendChild(tr);
        return;
    }

    listaParaExibir.forEach(c => {
        const statusTexto = c.status ? 'Liberado' : 'Bloqueado';
        const statusCor = c.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
        const botaoStatusTexto = c.status ? 'Bloquear' : 'Liberar';
        const botaoStatusCor = c.status ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900';

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50 transition-colors';
        tr.innerHTML = `
            <td class="px-6 py-4 text-sm text-gray-800 font-medium">${escapeHtml(c.nome)}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${formatarCPF(c.cpf)}</td>
            <td class="px-6 py-4 text-sm">
                <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusCor}">
                    <i class="fas ${c.status ? 'fa-unlock-alt' : 'fa-lock'} mr-1 text-xs"></i>
                    ${statusTexto}
                </span>
            </td>
            <td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                <button onclick="alternarStatus('${c.cpf}', ${c.status})" 
                    class="${botaoStatusCor} mr-3 transition-colors" title="${botaoStatusTexto}">
                    <i class="fas ${c.status ? 'fa-ban' : 'fa-check-circle'}"></i> ${botaoStatusTexto}
                </button>
                <button onclick="editarCliente('${c.cpf}')" 
                    class="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors" title="Editar">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="deletarCliente('${c.cpf}')" 
                    class="text-red-600 hover:text-red-900 transition-colors" title="Excluir">
                    <i class="fas fa-trash-alt"></i> Excluir
                </button>
            </td>
        `;
        tabelaCliente.appendChild(tr);
    });
}

// Validação do CPF (apenas números)
const inputCPF = document.getElementById('cpf');
inputCPF.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11);
});

// CONTROLE DE TELA
function mostrarLogin() {
    loginSection.classList.remove('hidden');
    adminSection.classList.add('hidden');
    const userInfo = document.getElementById('userInfo');
    if (userInfo) userInfo.classList.add('hidden');
    loginError.classList.add('hidden');
}

function mostrarPainelAdmin() {
    loginSection.classList.add('hidden');
    adminSection.classList.remove('hidden');
    const userInfo = document.getElementById('userInfo');
    if (userInfo) userInfo.classList.remove('hidden');
}

// Inicializar
iniciarApp();