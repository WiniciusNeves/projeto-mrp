# Desafio Técnico: Sistema MRP Simples

Este projeto implementa um Sistema de Planejamento de Necessidades de Materiais (MRP) para uma empresa que fabrica bicicletas e computadores. O objetivo é calcular automaticamente as necessidades de compra de componentes com base na produção planejada e no estoque atual, evitando interrupções na linha de montagem.

## Funcionalidades Implementadas

O sistema possui dois módulos principais:

### Módulo de Gerenciamento de Estoque (/estoque)

- **Cadastro de Componentes:** Permite adicionar novos componentes ao estoque (ex: Parafuso, Arruela).
- **Atualização de Estoque:** Permite ajustar a quantidade em estoque de componentes existentes.
- **Visualização:** Exibe o estoque atual de todos os componentes cadastrados de forma clara.
- **Persistência:** Todos os dados de componentes e estoque são armazenados em um banco de dados relacional.

### Módulo de Planejamento MRP (/mrp)

- **Entrada de Demanda:** Formulário para o usuário especificar a quantidade desejada de bicicletas e computadores a serem montados.
- **Cálculo Automático:** Realiza o cálculo das necessidades brutas e líquidas de cada componente, considerando o estoque atual.
- **Indicação de Compra:** Apresenta de forma clara a quantidade exata de cada componente que precisa ser comprada para atender à demanda de produção, destacando os itens com déficit.

## Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando as seguintes tecnologias:

### Backend

- **PHP (Puro):** Com uma arquitetura organizada de Controllers, Models e Core classes.
- **PDO:** Para a conexão segura e eficiente com o banco de dados.
- **MySQL:** Sistema de Gerenciamento de Banco de Dados Relacional.

> Nota: Pode ser adaptado para PostgreSQL ou SQLite com pequenas alterações na conexão e script SQL.

### Frontend

- **Next.js 13+ (App Router):** Framework React para construção de interfaces de usuário modernas e eficientes, com roteamento baseado em arquivos e Server/Client Components.
- **React:** Biblioteca JavaScript para construção de interfaces de usuário.
- **TypeScript:** Superconjunto tipado de JavaScript para maior robustez e manutenibilidade do código.
- **Tailwind CSS:** Framework CSS utilitário para estilização rápida e responsiva.

## Estrutura do Projeto

```plaintext
projeto-mrp/
├── README.md                 # Este arquivo de documentação
├── database/                 # Scripts SQL para o banco de dados
│   └── schema.sql            # Script de criação de tabelas e dados iniciais
├── src/                      # Código fonte do Backend (PHP)
│   ├── public/               # Ponto de entrada da aplicação PHP
│   │   └── index.php
│   ├── app/                  # Lógica da aplicação PHP (Controllers, Models, Core, Config)
│   │   ├── Config/
│   │   ├── Core/
│   │   ├── Controllers/
│   │   └── Models/
│   ├── vendor/               # Dependências do Composer e autoload.php
│   └── .htaccess             # Regras de reescrita para Apache (se usar)
└── frontend/                 # Código fonte do Frontend (Next.js/React)
    ├── public/               # Assets estáticos do Next.js
    ├── src/                  # Código fonte do Next.js
    │   ├── app/              # Estrutura do App Router (layout, page files por rota)
    │   │   ├── estoque/
    │   │   ├── mrp/
    │   │   └── (outros arquivos de rota e layout)
    │   ├── components/       # Componentes React reutilizáveis
    │   └── styles/           # Estilos globais (incluindo Tailwind)
    ├── tailwind.config.ts    # Configuração do Tailwind CSS
    ├── tsconfig.json         # Configuração do TypeScript
    ├── package.json          # Gerenciamento de dependências Node.js
    └── next.config.js
```

## Pré-requisitos

Para configurar e executar este projeto, você precisará ter o seguinte ambiente configurado:

### Servidor Web (com PHP)

- **XAMPP** (recomendado para Windows/macOS) ou LAMP/LEMP Stack (Linux) ou **Docker** (para ambiente isolado).
- **PHP >= 8.0**
- **Extensão PDO MySQL** (geralmente já habilitada no XAMPP).

### Banco de Dados MySQL

- **MySQL Server >= 5.7**

### Node.js

- **Node.js >= 18.x**

### Gerenciadores de Pacote

- **Composer** (para PHP)
- **npm** ou **yarn** (para Node.js)

## Como Executar o Projeto

Siga estes passos para ter o sistema rodando em sua máquina local:

### Clonar o Repositório

Primeiro, clone o repositório do projeto para sua máquina local e entre na pasta do projeto:

```bash
git clone https://github.com/WiniciusNeves/projeto-mrp
cd projeto-mrp
```

### Configuração do Banco de Dados

1. Inicie o MySQL através do seu XAMPP Control Panel ou serviço equivalente.

2. Crie o banco de dados:
   - Acesse [http://localhost/phpmyadmin](http://localhost/phpmyadmin) no seu navegador.
   - No painel lateral esquerdo, clique em "Novo" e crie um novo banco de dados chamado `mrp_db` (ou o nome que preferir, mas ajuste-o no `config.php`).

3. Importe o esquema do banco de dados:
   - No phpMyAdmin, selecione o banco de dados `mrp_db`.
   - Vá na aba "Importar".
   - Clique em "Escolher arquivo" e selecione o arquivo `database/schema.sql` dentro do diretório do seu projeto.
   - Role até o final da página e clique em "Executar".

4. Alternativa via linha de comando: Se preferir usar o terminal, navegue até a pasta `database/` (`cd database`) e execute o seguinte comando, substituindo `seu_usuario` e `sua_senha` (se houver):

   ```bash
   mysql -u seu_usuario -p mrp_db < schema.sql
   ```

   Exemplo para usuário root sem senha no XAMPP:

   ```bash
   mysql -u root mrp_db < schema.sql
   ```

   O sistema pedirá a senha, pressione Enter se não houver.

5. Configure as credenciais do banco de dados:

   Edite o arquivo `src/app/Config/config.php` e preencha com as credenciais do seu MySQL:

   ```php
   // src/app/Config/config.php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'mrp_db');   // Nome do DB que você criou
   define('DB_USER', 'root');     // Seu usuário MySQL
   define('DB_PASS', '');         // Sua senha MySQL (vazio se padrão XAMPP)
   define('DB_CHARSET', 'utf8mb4');
   ```

### Configuração e Inicialização do Backend (PHP)

1. Navegue para o diretório do backend:

   ```bash
   cd src
   ```

2. Instale as dependências e gere o autoload (Composer):
   - Execute o Composer para instalar quaisquer dependências (se houver no futuro) e para gerar o arquivo de autoload das classes, que permite que o PHP encontre suas classes automaticamente.

     ```bash
     composer install
     ```

   - Se você não tem um `composer.json` com autoload, crie um e execute 'composer dump-autoload'

     ```json
     { "autoload": { "psr-4": { "App\\": "app/" } } }
     ```

3. Inicie o servidor PHP embutido:
   - Este é o método recomendado para desenvolvimento rápido e local. O servidor estará acessível em [http://localhost:8000](http://localhost:8000), e suas APIs estarão em [http://localhost:8000/api/...](http://localhost:8000/api/...). Mantenha este terminal aberto.

     ```bash
     php -S localhost:8000 -t public
     ```

4. Alternativa (Apache): Se você estiver usando Apache, certifique-se de que o `.htaccess` em `src/` está configurado corretamente e que seu Virtual Host ou alias aponta para `src/public` para que todas as requisições sejam direcionadas para o `index.php`.

### Configuração e Inicialização do Frontend (Next.js)

Abra um NOVO terminal e navegue para o diretório do frontend:

 ```bash
   cd ../frontend
  ```

Configure as variáveis de ambiente:
Crie um arquivo chamado .env.local na raiz da pasta frontend/ (ao lado de package.json) e adicione a URL da sua API:

# frontend/.env.local

 ```bash
NEXT_PUBLIC_API_BASE_URL=<http://localhost:8000/api>
 ```
Importante: Adicione .env.local ao seu arquivo .gitignore na raiz da pasta frontend/ para evitar que ele seja versionado no Git.

# .gitignore na pasta frontend/

 ```bash
.env.local
 ```

Instale as dependências do Node.js:

 ```bash
   npm install
   # ou, se preferir yarn
   # yarn install
 ```
Inicie o servidor de desenvolvimento do Next.js:
Mantenha este terminal aberto. O frontend estará acessível em <http://localhost:3000>.

 ```bash
   npm run dev
   ou, se preferir yarn
   yarn dev
 ```

## Como Usar o Sistema

### Acessar a Aplicação:

Abra seu navegador e navegue para [http://localhost:3000](http://localhost:3000). Você será automaticamente redirecionado para a página de Estoque.

### Módulo de Gerenciamento de Estoque (/estoque):

- **Visualizar Estoque:** Nesta página, você pode visualizar todos os componentes e suas quantidades em estoque.
- **Cadastrar Novo Componente:** Preencha o "Nome do Componente" e a "Quantidade em Estoque" no formulário superior e clique em "Cadastrar Componente".
- **Atualizar Quantidade de Componente:** Clique em "Editar Quantidade" na linha do componente desejado na tabela. O formulário superior será preenchido com os dados do componente. Altere apenas a "Quantidade em Estoque" e clique em "Atualizar Estoque". O campo "Nome do Componente" ficará desabilitado, pois a edição é apenas para a quantidade.

### Módulo de Planejamento MRP (/mrp):

- **Acessar Planejamento MRP:** Navegue para a aba "MRP" no cabeçalho ou acesse [http://localhost:3000/mrp](http://localhost:3000/mrp).
- **Inserir Demanda de Produção:** No formulário "Demanda de Produção", insira a quantidade desejada de "Bicicletas a Montar" e "Computadores a Montar".
- **Calcular Necessidades MRP:** Clique em "Calcular Necessidades MRP".
- **Visualizar Resultados:** A tabela "Resultados do Cálculo MRP" exibirá:
  - **Componente:** O nome do item.
  - **Necessário:** Quantidade total deste componente para atender à sua demanda de produção.
  - **Em Estoque:** Quantidade atual do componente em seu estoque.
  - **A Comprar:** A quantidade de componentes que você precisa comprar (se "Necessário" for maior que "Em Estoque"). Itens que precisam ser comprados serão destacados com um ⚠️.

## Dicas de Desenvolvimento e Boas Práticas

- **Separação de Responsabilidades:** O projeto segue uma arquitetura que separa claramente o backend (lógica de negócio e banco de dados) do frontend (interface do usuário).
- **API RESTful:** O backend PHP expõe uma API RESTful simples para a comunicação com o frontend.
- **PDO:** Utilizado no PHP para segurança e flexibilidade na interação com o banco de dados, prevenindo SQL Injection.
- **TypeScript:** Usado no frontend para adicionar tipagem estática, melhorando a detecção de erros e a manutenibilidade do código.
- **Tailwind CSS:** Agiliza a estilização com classes utilitárias, permitindo um design responsivo.
- **Mensagens de Feedback:** A interface do usuário fornece feedback visual sobre as operações (sucesso/erro).
- **Validação de Entrada:** O backend inclui validações básicas para os dados recebidos.

