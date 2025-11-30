# Plano de Teste - Módulo Produtos

## 1. Introdução

### 1.1 Objetivo

Validar a funcionalidade completa do módulo de Produtos em um sistema de gestão de estoque, assegurando que operações de CRUD (Criar, Ler, Atualizar), filtros, validações, paginação e interações com a interface funcionem corretamente. Os testes visam identificar defeitos, garantir usabilidade e conformidade com os requisitos funcionais, utilizando testes automatizados para reduzir erros manuais e aumentar a eficiência.

### 1.2 Escopo

- **Incluído**: Testes E2E para cadastro, edição, filtros, validações de formulários, paginação e impressão de relatórios.
- **Excluído**: Testes de performance, carga, segurança avançada, integração com APIs externas (exceto mocks básicos) e testes manuais não automatizados.
- **Ferramentas**: Cypress (para execução), Docker (para ambiente), Node.js (para execução local).

### 1.3 Critérios de Aceitação

- Todos os casos de teste devem passar (status "Aprovado") em pelo menos 80% das execuções.
- Não devem haver falhas críticas (ex.: crashes ou dados incorretos).
- Cobertura mínima de 90% dos cenários funcionais identificados.

## 2. Requisitos Funcionais

Os testes são baseados nos seguintes requisitos funcionais extraídos do código e da lógica da aplicação:

- **RF01**: O usuário deve poder visualizar a lista de produtos em uma tabela paginada.
- **RF02**: O usuário deve poder cadastrar um novo produto com campos obrigatórios (nome, fornecedor, marca, código, estoque mínimo, preço, descrição), com validações de formato e obrigatoriedade.
- **RF03**: O sistema deve impedir cadastros com código duplicado, exibindo mensagens de erro.
- **RF04**: O usuário deve poder editar um produto existente, pré-preenchendo os campos atuais (apenas preço e descrição editáveis).
- **RF05**: O usuário deve poder filtrar produtos por nome, categoria ou estoque baixo, com opção de limpar filtros.
- **RF06**: O usuário deve poder navegar entre páginas e alterar o número de itens por página.
- **RF07**: O usuário deve poder imprimir um relatório de produtos sem erros, gerando uma nova janela com dados tabulares.
- **RF08**: Todas as operações devem exibir mensagens de sucesso/erro apropriadas e manter a integridade da interface.

## 3. Casos de Teste

A tabela abaixo detalha os casos de teste, mapeados aos requisitos funcionais. Cada caso inclui ID único, cenário, pré-condições, passos, resultado esperado e status (baseado na implementação atual em Cypress).

| ID   | Cenário                                  | Pré-Condições                                   | Passos                                                                 | Resultado Esperado                                                        | Status              | Requisito Relacionado |
| ---- | ---------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------- | --------------------- |
| CT01 | Exibir pop-up de cadastro                | Usuário logado, página de produtos carregada    | 1. Clicar em "Cadastrar".                                              | Modal de cadastro visível com título correto.                             | Implementado (skip) | RF02                  |
| CT02 | Exibir campos obrigatórios no cadastro   | Modal de cadastro aberto                        | 1. Verificar visibilidade dos campos (nome, fornecedor, etc.).         | Todos os campos obrigatórios visíveis e acessíveis.                       | Implementado (skip) | RF02                  |
| CT03 | Validar campo nome obrigatório           | Modal de cadastro aberto                        | 1. Clicar em "Salvar" sem preencher nome.                              | Mensagem de erro "Informe pelo menos 2 caracteres" exibida.               | Implementado (skip) | RF02                  |
| CT04 | Validar campo fornecedor obrigatório     | Modal de cadastro aberto                        | 1. Preencher nome, clicar em "Salvar" sem fornecedor.                  | Mensagem de erro "Selecione um fornecedor" exibida.                       | Implementado (skip) | RF02                  |
| CT05 | Validar campo marca obrigatório          | Modal de cadastro aberto                        | 1. Preencher nome e fornecedor, clicar em "Salvar" sem marca.          | Mensagem de erro "Informe pelo menos 2 caracteres" exibida.               | Implementado (skip) | RF02                  |
| CT06 | Validar campo código obrigatório         | Modal de cadastro aberto                        | 1. Preencher nome, fornecedor e marca, clicar em "Salvar" sem código.  | Mensagem de erro "Informe pelo menos 2 caracteres" exibida.               | Implementado (skip) | RF02                  |
| CT07 | Validar campo estoque mínimo obrigatório | Modal de cadastro aberto                        | 1. Preencher campos anteriores, clicar em "Salvar" sem estoque mínimo. | Mensagem de erro "Estoque mínimo é obrigatório" exibida.                  | Implementado (skip) | RF02                  |
| CT08 | Validar campo preço obrigatório          | Modal de cadastro aberto                        | 1. Preencher campos anteriores, clicar em "Salvar" sem preço.          | Mensagem de erro "Preço é obrigatório" exibida.                           | Implementado (skip) | RF02                  |
| CT09 | Validar campo descrição obrigatório      | Modal de cadastro aberto                        | 1. Preencher campos anteriores, clicar em "Salvar" sem descrição.      | Mensagem de erro "A descrição deve ter pelo menos 10 caracteres" exibida. | Implementado (skip) | RF02                  |
| CT10 | Criar produto com sucesso                | Modal de cadastro aberto                        | 1. Preencher todos os campos válidos, clicar em "Salvar".              | Produto criado, mensagem de sucesso exibida, produto na tabela.           | Implementado (skip) | RF02                  |
| CT11 | Erro ao criar com código duplicado       | Modal de cadastro aberto, produto existente     | 1. Preencher dados com código duplicado, clicar em "Salvar".           | Erro 400, mensagem "Já existe um produto com este código." exibida.       | Implementado (skip) | RF03                  |
| CT12 | Redirecionar para pop-up de edição       | Página de produtos carregada, produto existente | 1. Clicar na linha do produto, clicar em "Editar".                     | Modal de edição visível.                                                  | Implementado (skip) | RF04                  |
| CT13 | Atualizar produto com sucesso            | Modal de edição aberto                          | 1. Alterar preço e descrição, clicar em "Salvar".                      | Produto atualizado, mensagem de sucesso exibida.                          | Implementado (skip) | RF04                  |
| CT14 | Validar campos na edição                 | Modal de edição aberto                          | 1. Limpar preço, clicar em "Salvar".                                   | Validações aplicadas.                                                     | Implementado (skip) | RF04                  |
| CT15 | Filtrar por nome                         | Página de produtos carregada                    | 1. Digitar no campo de busca, pressionar Enter.                        | Resultados filtrados, URL com parâmetro correto.                          | Implementado (skip) | RF05                  |
| CT16 | Filtrar por categoria                    | Página de produtos carregada                    | 1. Selecionar categoria (ex.: A), aguardar.                            | Resultados filtrados, URL com "categoria=a".                              | Implementado (skip) | RF05                  |
| CT17 | Filtrar por estoque baixo                | Página de produtos carregada                    | 1. Ativar switch de estoque baixo.                                     | Resultados filtrados, URL com "estoque_baixo=true".                       | Implementado (skip) | RF05                  |
| CT18 | Limpar filtros                           | Filtros aplicados                               | 1. Clicar em "Limpar".                                                 | Filtros removidos, URL sem parâmetros de filtro.                          | Implementado (skip) | RF05                  |
| CT19 | Navegar para a próxima página            | Página de produtos carregada, múltiplas páginas | 1. Clicar em "Próxima".                                                | Página 2 carregada, URL com "page=2".                                     | Implementado (skip) | RF06                  |
| CT20 | Navegar para a página anterior           | Página 2 carregada                              | 1. Clicar em "Anterior".                                               | Página 1 carregada, URL com "page=1".                                     | Implementado (skip) | RF06                  |
| CT21 | Alterar itens por página                 | Página de produtos carregada                    | 1. Selecionar 20 itens por página.                                     | Lista atualizada, URL com "limite=20".                                    | Implementado        | RF06                  |
| CT22 | Imprimir relatório sem erros             | Página de produtos carregada, dados presentes   | 1. Clicar no botão de impressão.                                       | Botão clicável, sem alertas de erro, página permanece funcional.          | Implementado (skip) | RF07                  |

## 4. Ambiente de Teste

- **Software**:
  - Navegador: Chrome (versão estável).
  - Cypress: Versão 13+.
  - Node.js: Versão 18+.
  - Docker: Para executar a API backend (porta 5011) e frontend (porta 3000).
- **Dados de Teste**: Produto de exemplo - Nome: "Produto Teste [timestamp]", Código: "TEST[timestamp]", Preço: 100, etc. Limpeza automática via `after()` hook.

## 5. Riscos e Mitigações

- **Risco**: Dados de teste persistindo no banco. **Mitigação**: Hook `after()` para deletar produtos criados.
- **Risco**: Falhas de rede/API. **Mitigação**: Intercepts no Cypress para simular respostas.
- **Risco**: Mudanças na UI quebrando seletores. **Mitigação**: Uso de `data-test` attributes.

## 6. Execução

- **Pré-requisitos**:

  - Ambiente Docker rodando (backend na porta 5011, frontend na porta 3000).
  - Dependências instaladas: `npm install`.
  - Cypress configurado com variáveis de ambiente (FRONTEND_URL, API_URL).

- **Modo Interativo**:

  - Comando: `npx cypress open`.
  - Abre a interface do Cypress; selecione o arquivo `produtos.cy.ts` para executar testes passo a passo.

- **Execução Específica**:

  - Para um teste específico, adicione no terminal: `npx cypress run --spec cypress/e2e/produtos/produtos.cy.ts`.
