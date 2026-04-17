
---

# 🏋️ GymSports - Sistema de Controle de Acesso para Academia

![Status](https://img.shields.io/badge/status-online-brightgreen)
![Versão](https://img.shields.io/badge/version-1.0.0-blue)
![Licença](https://img.shields.io/badge/license-MIT-yellow)
![Frontend](https://img.shields.io/badge/frontend-HTML%2FCSS%2FJS-orange)

---

## 🌐 Acesse o projeto

🔗 **Demo online:**
👉 [https://backendacademia.vercel.app](https://backendacademia.vercel.app) *(substitua pelo seu front depois)*

---

## 🎥 Demonstração

![Demo do sistema](https://via.placeholder.com/400x600?text=GymSports+Catraca)

> 💡 Dica: depois você pode gravar um GIF com o celular e subir no GitHub pra deixar mais profissional ainda.

---

## 📋 Sobre o Projeto

Sistema de catraca digital para academia com interface moderna e responsiva, permitindo controle de acesso de alunos via CPF.

Projetado para uso em:

* 📱 Tablets
* 📲 Celulares
* 🖥️ Totens na recepção

---

## ✨ Funcionalidades

* 🔢 Digitação de CPF estilo teclado numérico
* ⚡ Validação em tempo real via API
* 🎯 Feedback visual imediato
* 📱 Interface responsiva (touch-friendly)
* 🎬 Animações suaves
* 🧹 Limpeza automática após uso

---

## 🚀 Tecnologias

* HTML5
* Tailwind CSS
* JavaScript (ES6+)
* Font Awesome
* Google Fonts (Inter)

---

## 📁 Estrutura

```
gymsports-catraca/
├── index.html
├── catraca.js
├── README.md
└── img/
```

---

## ⚙️ API

**Base URL:**

```
https://backendacademia.vercel.app
```

### Endpoint:

```
GET /clientes/{cpf}
```

---

## 🎯 Como usar

1. Digite o CPF
2. Clique no botão ➡️
3. Veja o resultado:

* ✅ Acesso liberado
* ❌ Pendência financeira
* ⚠️ Não encontrado
* 🔴 Erro

---

## 🔄 Fluxo

```
CPF → API → Validação → Feedback → Limpeza (3s)
```

---

## 🎨 UI

| Tipo     | Cor      |
| -------- | -------- |
| Fundo    | Preto    |
| Destaque | Amarelo  |
| Sucesso  | Verde    |
| Erro     | Vermelho |

---

## 🔒 Segurança

* HTTPS obrigatório
* Validação de CPF
* Rate limit recomendado
* Logs de acesso

---

## 🧠 Backend (exemplo)

```js
app.get('/clientes/:cpf', async (req, res) => {
  const cliente = await db.findClienteByCPF(req.params.cpf);

  if (!cliente) {
    return res.status(404).json({ erro: 'Cliente não encontrado' });
  }

  res.json(cliente);
});
```

---

## 🗄️ Banco de Dados

```sql
CREATE TABLE clientes (
  cpf VARCHAR(11) PRIMARY KEY,
  nome VARCHAR(100),
  status BOOLEAN
);
```

---

## 🐛 Problemas comuns

| Problema      | Solução       |
| ------------- | ------------- |
| Sem sinal     | Verificar API |
| Erro sistema  | Backend/CORS  |
| Layout bugado | Limpar cache  |

---

## 📈 Roadmap

* [ ] Reconhecimento facial
* [ ] QR Code
* [ ] Modo offline
* [ ] Dashboard admin
* [ ] App mobile

---

## 🤝 Contribuição

```bash
git checkout -b feature/minha-feature
git commit -m "feat: nova feature"
git push origin feature/minha-feature
```

---

## 📄 Licença

MIT

---

## 👨‍💻 Desenvolvedor

Projeto desenvolvido para **GymSports Academia**

---

## ⭐ Dica final (importante)

Troque esses itens para deixar perfeito:

* 🔗 Link do deploy → seu frontend (Vercel/Netlify)
* 🎥 GIF → grave um vídeo real do sistema
* 📸 Screenshot → print da interface

---


