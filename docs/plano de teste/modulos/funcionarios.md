# Plano de Teste - Módulo Funcionários

## 1. Introdução

### 1.1 Objetivo

Validar a funcionalidade completa do módulo de Funcionários em um sistema de gestão de estoque, assegurando que operações de CRUD (Criar, Ler, Atualizar, Deletar), filtros, validações e interações com a interface funcionem corretamente. Os testes visam identificar defeitos, garantir usabilidade e conformidade com os requisitos funcionais, utilizando testes automatizados para reduzir erros manuais e aumentar a eficiência.

### 1.2 Escopo

- **Incluído**: Testes E2E para cadastro, edição, desativação, filtros, validações de formulários, paginação e impressão de relatórios.
- **Excluído**: Testes de performance, carga, segurança avançada, integração com APIs externas (exceto mocks básicos), testes manuais não automatizados e validação de envio de email (processo assíncrono externo).
- **Ferramentas**: Cypress (para execução), Docker (para ambiente), Node.js (para execução local).

### 1.3 Critérios de Aceitação

- Todos os casos de teste devem passar (status "Aprovado") em pelo menos 80% das execuções.
- Não devem haver falhas críticas (ex.: crashes ou dados incorretos).
- Cobertura mínima de 90% dos cenários funcionais identificados.

## 2. Requisitos Funcionais

Os testes são baseados nos seguintes requisitos funcionais extraídos do código e da lógica da aplicação:

- **RF01**: O usuário deve poder visualizar a lista de funcionários em uma tabela paginada.
- **RF02**: O usuário deve poder cadastrar um novo funcionário com campos obrigatórios (nome, matrícula, email, telefone, perfil), com validações de formato e obrigatoriedade.
- **RF03**: O sistema deve impedir cadastros com matrícula duplicada, exibindo mensagens de erro.
- **RF04**: O sistema deve enviar um email de ativação após o cadastro bem-sucedido (validado apenas pela mensagem de confirmação na UI).
- **RF05**: O usuário deve poder editar um funcionário existente, alterando telefone e perfil.
- **RF06**: O usuário deve poder filtrar funcionários por nome, matrícula, email, perfil ou status (ativo/inativo), com opção de limpar filtros.
- **RF07**: O usuário deve poder navegar entre páginas e alterar o número de itens por página.
- **RF08**: O usuário deve poder imprimir um relatório de funcionários sem erros.
- **RF09**: Apenas usuários com perfil "administrador" podem modificar (criar, editar, desativar) funcionários.
- **RF10**: Todas as operações devem exibir mensagens de sucesso/erro apropriadas e manter a integridade da interface.

## 3. Casos de Teste

A tabela abaixo detalha os casos de teste, mapeados aos requisitos funcionais. Cada caso inclui ID único, cenário, pré-condições, passos, resultado esperado e status (baseado na implementação atual em Cypress).

| ID   | Cenário                               | Pré-Condições                                              | Passos                                                                      | Resultado Esperado                                                            | Status       | Requisito Relacionado |
| ---- | ------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------ | --------------------- |
| CT01 | Exibir pop-up de cadastro             | Usuário logado (ADM0001), página de funcionários carregada | 1. Clicar em "Cadastrar".                                                   | Modal de cadastro visível com título "Cadastro de funcionário".               | Implementado | RF02                  |
| CT02 | Validar campo nome obrigatório        | Modal de cadastro aberto                                   | 1. Preencher outros campos, deixar nome vazio. 2. Clicar em "Salvar".       | Mensagem de erro "Nome deve ter no mínimo 3 caracteres" exibida.              | Implementado | RF02                  |
| CT03 | Validar campo email obrigatório       | Modal de cadastro aberto                                   | 1. Preencher outros campos, deixar email vazio. 2. Clicar em "Salvar".      | Mensagem de erro "E-mail inválido" exibida.                                   | Implementado | RF02                  |
| CT04 | Validar formato de email              | Modal de cadastro aberto                                   | 1. Preencher email inválido (ex.: "email-invalido"). 2. Clicar em "Salvar". | Mensagem de erro "E-mail inválido" exibida.                                   | Implementado | RF02                  |
| CT05 | Validar campo telefone obrigatório    | Modal de cadastro aberto                                   | 1. Preencher outros campos, deixar telefone vazio. 2. Clicar em "Salvar".   | Mensagem de erro "Telefone inválido" exibida.                                 | Implementado | RF02                  |
| CT06 | Validar campo perfil obrigatório      | Modal de cadastro aberto                                   | 1. Preencher outros campos, não selecionar perfil. 2. Clicar em "Salvar".   | Mensagem de erro "Selecione um perfil" exibida.                               | Implementado | RF02                  |
| CT07 | Validar campo matrícula obrigatório   | Modal de cadastro aberto                                   | 1. Preencher outros campos, deixar matrícula vazia. 2. Clicar em "Salvar".  | Mensagem de erro "Informe pelo menos 2 caracteres" exibida.                   | Implementado | RF02                  |
| CT08 | Criar funcionário com sucesso         | Modal de cadastro aberto                                   | 1. Preencher todos os campos válidos. 2. Clicar em "Salvar".                | Funcionário criado (201), modal fecha, mensagens de sucesso e email exibidas. | Implementado | RF02, RF04            |
| CT09 | Erro ao criar com matrícula duplicada | Modal de cadastro aberto, funcionário existente            | 1. Preencher dados com matrícula duplicada. 2. Clicar em "Salvar".          | Erro 409, mensagens de erro exibidas, modal permanece aberto.                 | Implementado | RF03                  |
| CT10 | Redirecionar para pop-up de edição    | Página de funcionários carregada, funcionário existente    | 1. Clicar na segunda linha da tabela. 2. Clicar em "Editar".                | Modal de edição visível.                                                      | Implementado | RF05                  |
| CT11 | Atualizar funcionário com sucesso     | Modal de edição aberto                                     | 1. Alterar telefone e perfil. 2. Clicar em "Salvar".                        | Funcionário atualizado (200), dados corretos retornados, modal fecha.         | Implementado | RF05                  |
| CT12 | Validar campos na edição              | Modal de edição aberto                                     | 1. Limpar campo telefone. 2. Clicar em "Salvar".                            | Mensagem de erro "Telefone deve ter no mínimo 10 dígitos" exibida.            | Implementado | RF05                  |
| CT13 | Filtrar por nome                      | Página de funcionários carregada                           | 1. Digitar "Administrador Master" no campo de busca. 2. Pressionar Enter.   | Funcionário filtrado, dialog de listagem mostra nome correto.                 | Implementado | RF06                  |
| CT14 | Filtrar por email                     | Página de funcionários carregada                           | 1. Digitar "admin@sistema.com" no campo de busca. 2. Pressionar Enter.      | Funcionário filtrado, dialog de listagem mostra email correto.                | Implementado | RF06                  |
| CT15 | Filtrar por matrícula                 | Página de funcionários carregada                           | 1. Digitar "ADM0001" no campo de busca. 2. Pressionar Enter.                | Funcionário filtrado, dialog de listagem mostra matrícula correta.            | Implementado | RF06                  |
| CT16 | Filtrar por perfil (administrador)    | Página de funcionários carregada                           | 1. Selecionar "Administrador" no filtro de perfil.                          | URL com parâmetro "perfil=administrador", resultados filtrados.               | Implementado | RF06                  |
| CT17 | Filtrar por perfil (gerente)          | Página de funcionários carregada                           | 1. Selecionar "Gerente" no filtro de perfil.                                | URL com parâmetro "perfil=gerente", resultados filtrados.                     | Implementado | RF06                  |
| CT18 | Filtrar por perfil (estoquista)       | Página de funcionários carregada                           | 1. Selecionar "Estoquista" no filtro de perfil.                             | URL com parâmetro "perfil=estoquista", resultados filtrados.                  | Implementado | RF06                  |
| CT19 | Filtrar por status (inativo)          | Página de funcionários carregada                           | 1. Selecionar "Inativo" no filtro de status.                                | URL com parâmetro "ativo=false", resultados filtrados.                        | Implementado | RF06                  |
| CT20 | Limpar filtros                        | Filtros aplicados (busca, perfil, status)                  | 1. Aplicar filtros. 2. Clicar em "Limpar" após cada filtro.                 | Filtros removidos, URL sem parâmetros de filtro.                              | Implementado | RF06                  |
| CT21 | Navegar para próxima página           | Página de funcionários carregada, múltiplas páginas        | 1. Clicar no botão "Próxima página".                                        | URL com "page=2", tabela atualizada.                                          | Implementado | RF07                  |
| CT22 | Navegar para página anterior          | Segunda página carregada                                   | 1. Clicar no botão "Página anterior".                                       | URL com "page=1", tabela atualizada.                                          | Implementado | RF07                  |
| CT23 | Alterar itens por página              | Página de funcionários carregada                           | 1. Selecionar "20" no seletor de itens por página.                          | URL com "limite=20", tabela atualizada com mais itens.                        | Implementado | RF07                  |
| CT24 | Imprimir relatório sem erros          | Página de funcionários carregada, funcionário selecionado  | 1. Clicar na primeira linha. 2. Clicar no botão de impressão.               | Botão clicável, sem alertas de erro, página permanece funcional.              | Implementado | RF08                  |

## 4. Ambiente de Teste

- **Software**:
  - Navegador: Chrome (versão estável).
  - Cypress: Versão 15+.
  - Node.js: Versão 22+.
  - Docker: Para executar a API backend (porta 5011) e frontend (porta 3000).
- **Dados de Teste**:
  - Funcionário de exemplo - Nome: "Funcionário Teste Cypress", Matrícula: "TST-[timestamp]", Email: "test[timestamp]@empresa.com", Telefone: "(11) 98765-4321", Perfil: "Estoquista".
  - Usuário de teste: Matrícula "ADM0001", Senha "Admin@123" (perfil Administrador).
  - Limpeza automática via `after()` hook (desativação do funcionário criado).

## 5. Riscos e Mitigações

- **Risco**: Dados de teste persistindo no banco. **Mitigação**: Hook `after()` para desativar funcionários criados.
- **Risco**: Falhas de rede/API. **Mitigação**: Intercepts no Cypress para simular respostas.
- **Risco**: Mudanças na UI quebrando seletores. **Mitigação**: Uso de `data-test` attributes.
- **Risco**: Permissões insuficientes. **Mitigação**: Testes executados com usuário administrador (ADM0001).
- **Risco**: Email não recebido. **Mitigação**: Testes validam apenas a mensagem de confirmação na UI, não o recebimento real do email.

## 6. Execução

- **Pré-requisitos**:

  - Ambiente Docker rodando (backend na porta 5011, frontend na porta 3000).
  - Dependências instaladas: `npm install`.
  - Cypress configurado com variáveis de ambiente (FRONTEND_URL, API_URL).
  - Usuário ADM0001 com senha Admin@123 cadastrado no sistema.

- **Modo Interativo**:

  - Comando: `npx cypress open`.
  - Abre a interface do Cypress; selecione o arquivo `funcionarios.cy.ts` para executar testes passo a passo.

- **Execução Específica**:

  - Para um teste específico, adicione no terminal: `npx cypress run --spec cypress/e2e/funcionarios/funcionarios.cy.ts`.

## 7. Observações

- **Validação de Email**: O sistema envia um email de ativação após o cadastro, mas os testes Cypress validam apenas a mensagem de sucesso exibida na UI ("O email de ativação de conta foi enviado ao email cadastrado!"). A validação do recebimento real do email requer ferramentas como Mailhog ou Mailtrap (não incluídas no escopo atual).
- **Permissões**: Apenas usuários com perfil "administrador" podem criar, editar ou desativar funcionários. Os testes são executados com o usuário ADM0001 (administrador).
- **Matrícula Única**: A matrícula é gerada dinamicamente usando timestamp para evitar duplicatas entre execuções.
