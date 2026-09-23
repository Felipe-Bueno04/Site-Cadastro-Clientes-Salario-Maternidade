# Site-Cadastro-Clientes-Salario-Maternidade

## Como executar o projeto localmente

### Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

* Node.js
* npm
* VS Code

O projeto utiliza:

* Next.js
* TypeScript
* Prisma
* PostgreSQL / Supabase
* NextAuth
* Tailwind CSS

---

### 1. Abrir o projeto no VS Code

Abra no VS Code a pasta `clientes-maternidade`, que contém o arquivo `package.json` e os diretórios `prisma/`, `app/` e `lib/`.

---

### 2. Abrir o terminal

No VS Code, abra:

**Terminal → New Terminal**

Ou utilize o atalho:

```text
Ctrl + `
```

Execute os comandos abaixo dentro da pasta `clientes-maternidade`.

---

### 3. Criar e configurar o arquivo `.env`

Na pasta `clientes-maternidade`, crie ou edite o arquivo `.env` com as seguintes variáveis:

```env
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/BANCO_DE_DADOS"
DIRECT_URL="postgresql://USUARIO:SENHA@HOST:PORTA/BANCO_DE_DADOS"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="cole_aqui_o_secret_gerado"
```

Substitua `DATABASE_URL` e `DIRECT_URL` pelas credenciais do PostgreSQL ou Supabase. O `NEXTAUTH_URL` pode ser alterado para outra porta ou endereço disponível na sua máquina ou rede, por exemplo, `http://localhost:3001`.

Para gerar o `NEXTAUTH_SECRET`, execute na pasta do projeto:

```bash
npx auth secret
```

Copie o valor retornado para `NEXTAUTH_SECRET` no `.env`. Nunca compartilhe ou versiona esse arquivo, pois ele contém credenciais e secrets.

---

### 4. Instalar as dependências

Execute:

```bash
npm install
```

Esse comando instala todas as dependências definidas no `package.json`.

---

### 5. Gerar o Prisma Client

Depois de instalar as dependências, execute:

```bash
npx prisma generate
```

Esse comando gera o Prisma Client utilizado pelo projeto para comunicação com o banco de dados.

---

### 6. Executar o projeto

Com tudo configurado, execute:

```bash
npm run dev
```

Se o projeto iniciar corretamente, o terminal deverá mostrar o endereço local da aplicação, normalmente:

```text
http://localhost:3000
```

Acesse esse endereço pelo navegador.

---

### 7. Fluxo resumido

Caso esteja configurando o projeto novamente em uma máquina nova, execute nesta ordem:

```bash
npm install
npx prisma generate
npm run dev
```

---

### 8. Encerrar o servidor

Para parar o servidor de desenvolvimento, volte ao terminal onde o `npm run dev` está sendo executado e pressione:

```text
Ctrl + C
```

---

### 9. Executar novamente

Para iniciar novamente depois de parar o servidor:

```bash
npm run dev
```

Não é necessário reinstalar as dependências ou executar `prisma generate` toda vez que o projeto for iniciado, desde que elas já estejam configuradas.

---

### 10. Acesso local

Depois de executar:

```bash
npm run dev
```

acesse:

```text
http://localhost:3000
```

A aplicação possui autenticação e controle de acesso por tipo de usuário, incluindo os perfis:

* `ADMIN`
* `PARCEIRO`

O sistema também possui proteção de rotas e isolamento dos dados por `adminId`.

---

## Comandos principais

#### Instalar dependências

```bash
npm install
```

### Gerar Prisma Client

```bash
npx prisma generate
```

### Iniciar servidor de desenvolvimento

```bash
npm run dev
```

### Parar servidor

```text
Ctrl + C
```

---

## Sequência recomendada

Para uma instalação nova:

```bash
npm install
npx prisma generate
npm run dev
```

Para executar um projeto que já está configurado:

```bash
npm run dev
```