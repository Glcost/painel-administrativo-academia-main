🏋️ GymSports - Sistema de Controle de Acesso para Academia
📋 Sobre o Projeto
Sistema de catraca digital para academia com interface moderna e responsiva, permitindo controle de acesso de alunos via CPF. Desenvolvido para dispositivos touch (tablets/celulares) instalados na portaria da academia.

✨ Funcionalidades
✅ Digitação de CPF - Interface numérica estilo catraca digital

✅ Validação em tempo real - Consulta API para verificar status do aluno

✅ Feedback visual - Mensagens claras de sucesso, erro ou pendência

✅ Design responsivo - Adaptado para diferentes tamanhos de tela

✅ Animações suaves - Transições e feedbacks táteis

✅ Auto-limpeza - Limpa o visor automaticamente após cada tentativa

🚀 Tecnologias Utilizadas
Tecnologia	Versão	Finalidade
HTML5	-	Estrutura da aplicação
Tailwind CSS	3.0+	Estilização e responsividade
JavaScript ES6+	-	Lógica da aplicação
Font Awesome	6.0	Ícones visuais
Google Fonts (Inter)	-	Tipografia moderna
📁 Estrutura do Projeto
text
gymsports-catraca/
│
├── index.html              # Interface principal da catraca
├── catraca.js              # Lógica de funcionamento
├── README.md               # Documentação completa
│
└── img/
    └── logogym.png         # Favicon da academia
🔧 Pré-requisitos
Para uso (frontend):
Navegador moderno (Chrome, Firefox, Edge, Safari)

Conexão com internet (para carregar CDNs e acessar API)

Para desenvolvimento:
Editor de código (VS Code recomendado)

Servidor local (opcional, pode abrir o HTML diretamente)

Acesso ao backend da academia (API configurada)

⚙️ Configuração da API
Endpoint utilizado:
text
https://backendacademia.vercel.app
Estrutura esperada da API:
GET /clientes/{cpf}
Resposta de sucesso (200):

json
{
    "cpf": "12345678900",
    "nome": "João Silva Santos",
    "status": true,
    "plano": "Mensal",
    "vencimento": "2024-12-31"
}
Resposta de erro (404):

json
{
    "erro": "Cliente não encontrado"
}
Resposta de erro (500):

json
{
    "erro": "Erro interno do servidor"
}
🎯 Como Usar
1. Acesso via CPF
O usuário digita o CPF (11 dígitos) usando o teclado numérico

Pressiona o botão verde (➡️) para confirmar

O sistema consulta a API e exibe:

✅ SUCESSO - "OLÁ, [NOME]!" + ícone verde

❌ PENDÊNCIA FINANCEIRA - Mensagem em vermelho

⚠️ NÃO ENCONTRADO - CPF não cadastrado

🔴 ERRO DE SISTEMA - Problemas na API

2. Funcionalidades dos Botões
Botão	Função
0-9	Digitar números do CPF
✖️ (X)	Limpar CPF atual
➡️ (Verde)	Confirmar e verificar acesso
3. Fluxo Visual
text
Digitação → Loading → Validação → Feedback → Auto-limpeza (3s)
🎨 Interface e Estilos
Cores Principais
Fundo: Preto (#000000)

Destaque: Amarelo GymSports (#FFD700)

Cards: Zinc-900 (#18181B)

Sucesso: Verde (#10B981)

Erro: Vermelho (#EF4444)

Aviso: Amarelo (#EAB308)

Animações
Hover nos botões (escurecimento)

Scale ativo no botão confirmar

Transições suaves de cores

Ícone de loading durante requisição

📱 Responsividade
Mobile: max-width: 100% com padding

Tablet: Container com max-w-sm

Desktop: Centralizado com fundo preto

Touch: Botões grandes (64px de altura) para fácil toque

🔌 Integração com Backend
Fluxo de requisição:
javascript
1. Usuário digita CPF (11 dígitos)
   ↓
2. Clica em verificar
   ↓
3. GET /clientes/{cpf}
   ↓
4. Analisa resposta:
   - 200 + status=true → Acesso liberado
   - 200 + status=false → Pendência financeira
   - 404 → Não encontrado
   - Outros → Erro de sistema
   ↓
5. Exibe feedback visual
   ↓
6. Limpa campos após 3 segundos
Tratamento de erros:
❌ Falha de rede → "SEM SINAL"

❌ Timeout → "ERRO DE SISTEMA"

❌ API offline → Mensagem amigável

🚦 Códigos de Status e Mensagens
Status	Mensagem	Cor	Ícone
200 + status=true	OLÁ, [NOME]!	Verde	✅
200 + status=false	PENDÊNCIA FINANCEIRA	Vermelho	❌
404	NÃO ENCONTRADO	Amarelo	?
500+	ERRO DE SISTEMA	Vermelho	!!!
Network Error	SEM SINAL	Vermelho	📡
🛠️ Personalização
Alterar URL da API
No arquivo catraca.js, modifique a constante:

javascript
const API_BASE_URL = 'https://sua-api.com.br';
Alterar tempo de auto-limpeza
javascript
setTimeout(() => {
    limpar();
}, 3000); // Altere os milissegundos aqui
Modificar cores no Tailwind
html
<!-- Exemplo: alterar cor de destaque -->
<div class="bg-blue-500"> <!-- ao invés de bg-smart-yellow -->
🔒 Segurança
Recomendações:
✅ HTTPS - Sempre use conexão segura com a API

✅ Validação de CPF - Implementar validação de dígito verificador

✅ Rate Limiting - Proteger contra múltiplas tentativas

✅ Logs de acesso - Registrar todas as tentativas (sucesso/fracasso)

✅ CORS - Configurar corretamente no backend

Melhorias sugeridas:
javascript
// Validação de CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11) return false;
    // Implementar validação de dígito verificador
    return true;
}
📊 Exemplo de Uso no Backend
Node.js + Express:
javascript
app.get('/clientes/:cpf', async (req, res) => {
    const { cpf } = req.params;
    
    try {
        const cliente = await db.findClienteByCPF(cpf);
        
        if (!cliente) {
            return res.status(404).json({ erro: 'Cliente não encontrado' });
        }
        
        return res.json({
            cpf: cliente.cpf,
            nome: cliente.nome,
            status: cliente.status_pagamento,
            plano: cliente.plano,
            vencimento: cliente.data_vencimento
        });
    } catch (error) {
        return res.status(500).json({ erro: 'Erro interno' });
    }
});
Banco de dados (exemplo MySQL):
sql
CREATE TABLE clientes (
    cpf VARCHAR(11) PRIMARY KEY,
    nome VARCHAR(100),
    status BOOLEAN DEFAULT true,
    plano VARCHAR(50),
    vencimento DATE,
    ultimo_acesso DATETIME
);
🐛 Possíveis Problemas e Soluções
Problema	Causa	Solução
"SEM SINAL"	API offline	Verificar conexão com backend
"ERRO DE SISTEMA"	CORS ou erro 500	Configurar CORS no servidor
Botões não funcionam	JavaScript bloqueado	Permitir scripts no navegador
Layout quebrado	Cache do navegador	Limpar cache ou hard refresh
CPF não valida	API retorna 404	Verificar se CPF está cadastrado
📈 Próximas Implementações
Sugestões de melhoria:
Reconhecimento facial - Integrar com FaceAPI.js

QR Code - Leitura de código de barras do app

Biometria digital - Para academias com leitores

Dashboard - Estatísticas de acesso em tempo real

Impressão de comprovante - Para entrada de visitantes

Offline First - Cache de alunos para funcionamento sem internet

Multi-idiomas - Suporte a inglês/espanhol

Dark/Light mode - Alternância de temas

🤝 Contribuição
Faça um Fork do projeto

Crie sua Feature Branch (git checkout -b feature/AmazingFeature)

Commit suas mudanças (git commit -m 'Add some AmazingFeature')

Push para a Branch (git push origin feature/AmazingFeature)

Abra um Pull Request

📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

📞 Suporte
Documentação: [Link para documentação online]

Issues: Abrir ticket no repositório

Email: suporte@gymsports.com.br

👨‍💻 Desenvolvedor
Desenvolvido para GymSports Academia - Sistema de controle de acesso moderno e eficiente.

🌟 Demonstração
https://via.placeholder.com/400x600?text=GymSports+Catraca

Exemplo de uso:
text
1. Digitar CPF: 12345678900
2. Sistema: "OLÁ, JOÃO!"
3. Acesso liberado ✓
4. Limpa após 3 segundos
📝 Changelog
v1.0.0 (2024)
✅ Primeira versão estável

✅ Interface completa da catraca

✅ Integração com API REST

✅ Feedback visual completo

✅ Design responsivo