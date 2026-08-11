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

Abra no VS Code a pasta raiz do projeto.

A pasta deve conter arquivos e diretórios semelhantes a:

```text
package.json
prisma/
app/
lib/
middleware.ts
```

---

### 2. Abrir o terminal

No VS Code, abra:

**Terminal → New Terminal**

Ou utilize o atalho:

```text
Ctrl + `
```

---

### 3. Instalar as dependências

Caso seja a primeira vez executando o projeto na máquina, rode:

```bash
npm install
```

Esse comando instala todas as dependências definidas no `package.json`.

---

### 4. Gerar o Prisma Client

Depois de instalar as dependências, execute:

```bash
npx prisma generate
```

Esse comando gera o Prisma Client utilizado pelo projeto para comunicação com o banco de dados.

---

### 5. Verificar as variáveis de ambiente

O projeto utiliza variáveis de ambiente para configurações como:

* Conexão com o banco de dados PostgreSQL / Supabase
* Secret utilizado pelo NextAuth

Verifique se o arquivo de variáveis de ambiente está configurado corretamente antes de iniciar o sistema.

Exemplo de arquivo:

```text
.env
```

Não compartilhe ou versiona informações sensíveis, como senhas, chaves ou secrets.

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

Se o projeto já estiver configurado e as dependências já estiverem instaladas, normalmente basta executar:

```bash
npm run dev
```

Caso esteja configurando o projeto novamente em uma máquina nova:

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