# AluraCord - Imersão React 4

> Projeto feito na Imersão React 4, da Alura. Nesse evento, foi mostrado como criar um site de bate papo utilizando Next.js, Vercel e Supabase. 
>
>Nesse projeto, pretendo adicionar algumas funcionalidades a mais do que nos foram passado.

## Como utilizar esse projeto
Para utilizar esse projeto, você precisa do Docker e Docker-Compose ou do NodeJs (no caso eu utilizei a versão 16 LTS do node). Além de uma conta no Supabase

### Configurando o Banco de dados no Supabase:

- Para fazer a conexão com o banco, primeiro você precisa configurar o mesmo no Supabase:
    1. Crie uma tabela chamada `mensagens`
    2. Adicione as colunas a seguir:


    <table>
  <tr>
    <td align="center">
      Name
    </td>
    <td align="center">
      Type
    </td>
    <td align="center">
      Observações
    </td>
  </tr>
  <tr>
    <td align="center">
      id
    </td>
    <td align="center">
      int8
    </td>
    <td align="center">
      marcar <bold>primary</bold> e <bold>is identity</bold>
    </td>
  </tr>  
  <tr>
    <td align="center">
      created_at
    </td>
    <td align="center">
      timestamptz
    </td>
    <td align="center">
      Default value: <bold>now()</bold> 
    </td>
  </tr>
  <tr>
    <td align="center">
      de
    </td>
    <td align="center">
      text
    </td>
    <td align="center">
      &nbsp
    </td>
  </tr>
  <tr>
    <td align="center">
      texto
    </td>
    <td align="center">
      text
    </td>
    <td align="center">
      &nbsp
    </td>
  </tr>
    </table>

- Após isso, vá em `Database > Replication`, clique em **0 table** e seleciona a tabela criada.
- Com isso o servidor está pronto, procure pelo **link de conexão** e a **chave anonima** para usa-las no projeto.

### Configurando projeto para rodar na máquina local:
- Na pasta do repositório clonado, crie um arquivo chamado `.env.local` e adicione as seguintes linhas:
    ```
    NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA CHAVE ANONIMA

    NEXT_PUBLIC_SUPABASE_URL=O LINK PARA A CONEXÃO COM O BANCO DE DADOS
    ```
- Para rodar o site dê o comando `sudo yarn install` e `yarn dev` e acessar o site **localhost:3000**

Caso prefira, há um script para o Docker-Composer que permite rodar um container com o projeto, expondo a porta **3000** para acessar o site. Porém ainda é necessário se conectar no container e dar os comandos acima manualmente. No futuro pretendo criar um `Dockerfile` para tornar esse processo mais automático.

## TODO:
- [x] Montar site de acordo com as aulas da Imersão
- [ ] Fazer todos os desafios propostos
- [ ] Resolver bugs em relação ao layout do site
- [ ] Revisar configuração do backend, visando mais proteção dos dados e permitir que o código rode mais independente do Supabase
- [ ] Add suporte a Markdown
