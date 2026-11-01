# HIRO — projeto com IA

O HIRO usa a API Gemini no servidor. A chave fica em uma variável de ambiente e **não** no HTML público.

## Arquivos
- `index.html`: interface do chat.
- `api/chat.js`: função de servidor que conversa com o Gemini.
- `package.json`: configuração do projeto.

## Publicar
1. Um adulto responsável deve ajudar a criar e administrar as contas necessárias e verificar os termos, idade mínima e possíveis custos do serviço.
2. Coloque estes arquivos em um repositório GitHub privado ou público, sem incluir chaves secretas.
3. Importe o repositório na Vercel.
4. Nas configurações do projeto na Vercel, abra **Settings → Environment Variables**.
5. Crie a variável `GEMINI_API_KEY` e cole nela a chave obtida pelo responsável no Google AI Studio.
6. Faça um novo deploy. A chave nunca deve ser colocada no `index.html`, em mensagem de chat ou em repositório.
7. Abra o endereço `.vercel.app` gerado pela Vercel.

## Testar localmente
É necessário Node.js e Vercel CLI:
```bash
npm install -g vercel
vercel dev
```
Configure `GEMINI_API_KEY` no ambiente local antes de iniciar.

## Observações
- O HIRO usa `gemini-3.8-flash` pela Gemini Interactions API.
- A disponibilidade, os limites e os preços da API podem mudar. Verifique no painel oficial antes de usar.
- Não publique uma chave de API nem envie a chave para o chat.
