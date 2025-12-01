# Plano de Teste - Módulo Fornecedores

## 1. Introdução

### 1.1 Objetivo

Validar a funcionalidade completa do módulo de Fornecedores em um sistema de gestão de estoque, assegurando que operações de CRUD (Criar, Ler, Atualizar, Deletar), filtros, validações e interações com a interface funcionem corretamente. Os testes visam identificar defeitos, garantir usabilidade e conformidade com os requisitos funcionais, utilizando testes automatizados para reduzir erros manuais e aumentar a eficiência.

### 1.2 Escopo

- **Incluído**: Testes E2E para cadastro, edição, exclusão (desativação), filtros, validações de formulários e impressão de relatórios.
- **Excluído**: Testes de performance, carga, segurança avançada, integração com APIs externas (exceto mocks básicos) e testes manuais não automatizados.
- **Ferramentas**: Cypress (para execução), Docker (para ambiente), Node.js (para execução local).

### 1.3 Critérios de Aceitação

- Todos os casos de teste devem passar (status "Aprovado") em pelo menos 80% das execuções.
- Não devem haver falhas críticas (ex.: crashes ou dados incorretos).
- Cobertura mínima de 90% dos cenários funcionais identificados.

## 2. Requisitos Funcionais

Os testes são baseados nos seguintes requisitos funcionais extraídos do código e da lógica da aplicação:

- **RF01**: O usuário deve poder visualizar a lista de fornecedores em uma tabela paginada.
- **RF02**: O usuário deve poder cadastrar um novo fornecedor com campos obrigatórios (nome, CNPJ, telefone, email, CEP, logradouro, estado), com validações de formato e obrigatoriedade.
- **RF03**: O sistema deve impedir cadastros com CNPJ ou email duplicados, exibindo mensagens de erro.
- **RF04**: O usuário deve poder editar um fornecedor existente, pré-preenchendo os campos atuais.
- **RF05**: O usuário deve poder desativar um fornecedor com confirmação via modal.
- **RF06**: O usuário deve poder filtrar fornecedores por nome ou status (ativo/inativo), com opção de limpar filtros.
- **RF07**: O usuário deve poder imprimir um relatório de fornecedores sem erros, gerando uma nova janela com dados tabulares.
- **RF08**: Todas as operações devem exibir mensagens de sucesso/erro apropriadas e manter a integridade da interface.

## 3. Casos de Teste

A tabela abaixo detalha os casos de teste, mapeados aos requisitos funcionais. Cada caso inclui ID único, cenário, pré-condições, passos, resultado esperado e status (baseado na implementação atual em Cypress).

| ID   | Cenário                                | Pré-Condições                                          | Passos                                                                    | Resultado Esperado                                                    | Status              | Requisito Relacionado |
| ---- | -------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------- | --------------------- |
| CT01 | Exibir pop-up de cadastro              | Usuário logado, página de fornecedores carregada       | 1. Clicar em "Cadastrar".                                                 | Modal de cadastro visível com título correto.                         | Implementado        | RF02                  |
| CT02 | Exibir campos obrigatórios no cadastro | Modal de cadastro aberto                               | 1. Verificar visibilidade dos campos (nome, CNPJ, etc.).                  | Todos os campos obrigatórios visíveis e acessíveis.                   | Implementado        | RF02                  |
| CT03 | Validar campo nome obrigatório         | Modal de cadastro aberto                               | 1. Clicar em "Salvar" sem preencher nome.                                 | Mensagem de erro "Informe pelo menos 2 caracteres" exibida.           | Implementado        | RF02                  |
| CT04 | Validar campo CNPJ obrigatório         | Modal de cadastro aberto                               | 1. Preencher nome, clicar em "Salvar" sem CNPJ.                           | Mensagem de erro "CNPJ inválido" exibida.                             | Implementado        | RF02                  |
| CT05 | Validar formato do CNPJ                | Modal de cadastro aberto                               | 1. Preencher nome e CNPJ inválido (ex.: "123456789"), clicar em "Salvar". | Mensagem de erro "CNPJ inválido" exibida.                             | Implementado        | RF02                  |
| CT06 | Validar formato do email               | Modal de cadastro aberto                               | 1. Preencher nome, CNPJ válido e email inválido, clicar em "Salvar".      | Mensagem de erro "Email inválido" exibida.                            | Implementado        | RF02                  |
| CT07 | Validar mínimo de caracteres no nome   | Modal de cadastro aberto                               | 1. Preencher nome com 1 caractere, clicar em "Salvar".                    | Mensagem de erro "Informe pelo menos 2 caracteres" exibida.           | Implementado        | RF02                  |
| CT08 | Criar fornecedor com sucesso           | Modal de cadastro aberto                               | 1. Preencher todos os campos válidos, clicar em "Salvar".                 | Fornecedor criado, mensagem de sucesso exibida, fornecedor na tabela. | Implementado        | RF02                  |
| CT09 | Erro ao criar com CNPJ duplicado       | Modal de cadastro aberto, fornecedor existente         | 1. Preencher dados com CNPJ duplicado, clicar em "Salvar".                | Erro 400, mensagem "CNPJ já cadastrado" exibida.                      | Implementado        | RF03                  |
| CT10 | Erro ao criar com email duplicado      | Modal de cadastro aberto, fornecedor existente         | 1. Preencher dados com email duplicado, clicar em "Salvar".               | Erro 400, mensagem "Email já cadastrado" exibida.                     | Implementado        | RF03                  |
| CT11 | Redirecionar para pop-up de edição     | Página de fornecedores carregada, fornecedor existente | 1. Clicar na linha do fornecedor, clicar em "Editar".                     | Modal de edição visível.                                              | Implementado        | RF04                  |
| CT12 | Atualizar fornecedor com sucesso       | Modal de edição aberto                                 | 1. Alterar nome, clicar em "Salvar".                                      | Fornecedor atualizado, mensagem de sucesso exibida.                   | Implementado        | RF04                  |
| CT13 | Validar campos na edição               | Modal de edição aberto                                 | 1. Limpar nome, clicar em "Salvar".                                       | Validações iguais ao cadastro aplicadas.                              | Implementado        | RF04                  |
| CT14 | Exibir detalhes do fornecedor          | Página de fornecedores carregada                       | 1. Clicar na linha do fornecedor.                                         | Modal de listagem visível.                                            | Implementado        | RF05                  |
| CT15 | Desativar fornecedor com confirmação   | Modal de listagem aberto                               | 1. Clicar em "Excluir", confirmar.                                        | Fornecedor desativado, mensagem de sucesso exibida.                   | Implementado        | RF05                  |
| CT16 | Filtrar por nome                       | Página de fornecedores carregada                       | 1. Digitar no campo de busca, pressionar Enter.                           | Resultados filtrados, URL com parâmetro correto.                      | Implementado        | RF06                  |
| CT17 | Filtrar por status                     | Página de fornecedores carregada                       | 1. Selecionar status (ex.: inativo), aguardar.                            | Resultados filtrados, URL com "status=false".                         | Implementado        | RF06                  |
| CT18 | Limpar filtros                         | Filtros aplicados                                      | 1. Clicar em "Limpar".                                                    | Filtros removidos, URL sem parâmetros de filtro.                      | Implementado        | RF06                  |
| CT19 | Imprimir relatório sem erros           | Página de fornecedores carregada, dados presentes      | 1. Clicar no botão de impressão.                                          | Botão clicável, sem alertas de erro, página permanece funcional.      | Implementado (skip) | RF07                  |

## 4. Ambiente de Teste

- **Software**:
  - Navegador: Chrome (versão estável).
  - Cypress: Versão 13+.
  - Node.js: Versão 18+.
  - Docker: Para executar a API backend (porta 5011) e frontend (porta 3000).
- **Dados de Teste**: Fornecedor de exemplo - Nome: "Fornecedor Teste [timestamp]", CNPJ: "12.345.678/0001-90", Email: "teste@empresa.com", etc. Limpeza automática via `after()` hook.

## 5. Riscos e Mitigações

- **Risco**: Dados de teste persistindo no banco. **Mitigação**: Hook `after()` para deletar fornecedores criados.
- **Risco**: Falhas de rede/API. **Mitigação**: Intercepts no Cypress para simular respostas.
- **Risco**: Mudanças na UI quebrando seletores. **Mitigação**: Uso de `data-test` attributes.

## 6. Execução

- **Pré-requisitos**:

  - Ambiente Docker rodando (backend na porta 5011, frontend na porta 3000).
  - Dependências instaladas: `npm install`.
  - Cypress configurado com variáveis de ambiente (FRONTEND_URL, API_URL).

- **Modo Interativo**:

  - Comando: `npx cypress open`.
  - Abre a interface do Cypress; selecione o arquivo `fornecedores.cy.ts` para executar testes passo a passo.

- **Execução Específica**:

  - Para um teste específico, adicione no terminal: `npx cypress run --spec cypress/e2e/fornecedores/fornecedores.cy.ts`.
