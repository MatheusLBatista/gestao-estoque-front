# Plano de Teste - Sistema de Gestão de Estoque

## 1. Introdução

### 1.1 Objetivo

Validar a funcionalidade completa do Sistema de Gestão de Estoque, assegurando que operações de autenticação, CRUD de fornecedores, produtos e movimentações, filtros, validações, dashboard e interações com a interface funcionem corretamente. Os testes visam identificar defeitos, garantir usabilidade, conformidade com requisitos funcionais e não funcionais, utilizando testes automatizados para reduzir erros manuais e aumentar a eficiência.

### 1.2 Escopo

- **Incluído**: Testes E2E com Cypress para módulos principais: Autenticação, Usuários, Fornecedores, Produtos, Movimentações e Dashboard. Inclui validações positivas, negativas, filtros, relatórios e integrações com API.
- **Excluído**: Testes de performance, carga, segurança avançada (exceto autenticação básica), testes unitários/integração de backend, e testes manuais não automatizados.
- **Ferramentas**: Cypress (E2E), Docker (ambiente), Node.js (execução), Postman (validação de APIs).

### 1.3 Critérios de Aceitação

- Todos os casos de teste devem passar (status "Aprovado") em pelo menos 80% das execuções.
- Não devem haver falhas críticas (ex.: crashes, dados incorretos ou bloqueios de funcionalidades).
- Cobertura mínima de 90% dos cenários funcionais identificados.
- Bugs com severidade Blocker ou Critical devem ser corrigidos antes do release.

## 2. Arquitetura e Stack Tecnológica

O sistema utiliza Next.js com App Router para o frontend, implementando SSR/CSR conforme necessário. Comunicação via API REST com autenticação JWT.

- **Frontend**: Next.js, React, TypeScript, TailwindCSS, React Query, NextAuth.js, Radix UI, Cypress.
- **Backend**: API REST (não testada aqui, mas integrada).
- **Fluxo**: Cliente → Requisição HTTP com JWT → API → Resposta JSON → Atualização de UI.

## 3. Requisitos Funcionais e Não Funcionais

### Requisitos Funcionais

- **RF01**: O sistema deve permitir autenticação segura de usuários (login/logout) com validações.
- **RF02**: O sistema deve permitir CRUD de fornecedores com validações (nome único, CNPJ, etc.).
- **RF03**: O sistema deve permitir CRUD de produtos com controle de estoque via movimentações.
- **RF04**: O sistema deve registrar movimentações (entradas/saídas) e atualizar estoque em tempo real.
- **RF05**: O sistema deve exibir dashboard com estatísticas e gráficos.
- **RF06**: O sistema deve permitir filtros e buscas em todas as entidades.
- **RF07**: O sistema deve gerar relatórios e permitir impressão/exportação.
- **RF08**: O sistema deve permitir CRUD de usuários com diferentes níveis de acesso.
- **RF09**: O sistema deve permitir a paginação dos dados das tabelas.

### Requisitos Não Funcionais

- **NF01**: O sistema deve exibir mensagens de feedback (toast notifications) para ações.
- **NF02**: O sistema deve implementar proteção de rotas autenticadas.
- **NF03**: O sistema deve ter tempo de resposta < 5s para operações principais.

## 4. Casos de Teste

A tabela abaixo detalha os casos de teste principais, agrupados por módulo. Cada caso inclui ID único, cenário, pré-condições, passos, resultado esperado, status e requisito relacionado.

| ID   | Módulo        | Cenário                         | Pré-Condições             | Passos                                                                  | Resultado Esperado                                   | Status       | Requisito |
| ---- | ------------- | ------------------------------- | ------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------- | ------------ | --------- |
| CT01 | Autenticação  | Login com credenciais válidas   | Usuário cadastrado        | 1. Acessar /login, inserir matrícula/senha, clicar em "Entrar".         | Login bem-sucedido, redirecionamento para dashboard. | Implementado | RF01      |
| CT02 | Autenticação  | Login com credenciais inválidas | -                         | 1. Inserir dados incorretos, clicar em "Entrar".                        | Mensagem de erro exibida, sem redirecionamento.      | Implementado | RF01      |
| CT03 | Fornecedores  | Cadastrar fornecedor válido     | Usuário logado, admin     | 1. Acessar /fornecedores, clicar "Cadastrar", preencher campos, salvar. | Fornecedor criado, mensagem de sucesso, na tabela.   | Implementado | RF02      |
| CT04 | Fornecedores  | Validar CNPJ duplicado          | Fornecedor existente      | 1. Tentar cadastrar com CNPJ repetido.                                  | Erro exibido, cadastro impedido.                     | Implementado | RF02      |
| CT05 | Fornecedores  | Filtrar por status              | Fornecedores na tabela    | 1. Selecionar filtro de status, aguardar.                               | Resultados filtrados, URL atualizada.                | Implementado | RF06      |
| CT06 | Produtos      | Cadastrar produto válido        | Usuário logado            | 1. Acessar /produtos, clicar "Cadastrar", preencher, salvar.            | Produto criado, estoque atualizado.                  | Pendente     | RF03      |
| CT07 | Produtos      | Movimentação de entrada         | Produto existente         | 1. Registrar entrada via movimentação.                                  | Estoque aumentado, registro salvo.                   | Pendente     | RF04      |
| CT08 | Movimentações | Visualizar histórico            | Movimentações registradas | 1. Acessar /movimentacoes, verificar tabela.                            | Histórico exibido corretamente.                      | Pendente     | RF04      |
| CT09 | Dashboard     | Exibir estatísticas             | Dados no sistema          | 1. Acessar /home, verificar cards e gráficos.                           | Dados atualizados e visíveis.                        | Pendente     | RF05      |
| CT10 | Geral         | Imprimir relatório              | Dados presentes           | 1. Clicar em botão de impressão.                                        | Nova janela aberta sem erros.                        | Implementado | RF07      |

## 5. Estratégia de Teste

- **Escopo**: Testes E2E para funcionalidades críticas; testes unitários (60% cobertura) e integração (endpoints) são complementares.
- **Abordagem**: Cenários positivos/negativos, validações de UI/API, relatórios automáticos.
- **Ambiente**: Homologação com Docker, dados de seed.
- **Ferramentas**: Cypress (E2E), Postman (APIs), Docker.

## 6. Ambiente de Teste

- **Software**: Chrome, Cypress 13+, Node.js 18+, Docker (backend porta 5011, frontend 3000).
- **Dados**: Usuários admin, fornecedores/produtos de exemplo; limpeza automática.

## 7. Riscos e Mitigações

- **Risco**: Dependências de API instáveis. **Mitigação**: Intercepts no Cypress.
- **Risco**: Dados inconsistentes. **Mitigação**: Seeds e limpeza pós-teste.
- **Risco**: Mudanças na UI. **Mitigação**: Atributos `data-test`.

## 8. Classificação de Bugs

- **Blocker**: Bloqueia funcionalidades críticas, crashes.
- **Critical**: Funcionalidade não funciona como esperado.
- **Major**: Critérios de aceitação não atendidos.
- **Minor**: Pequenos erros de UI/ortografia.

## 9. Responsabilidades

- **Testador**: Executar testes, reportar bugs.
- **Desenvolvedor**: Corrigir issues.
- **Gerente**: Aprovar releases.

## 10. Execução

- **Pré-requisitos**: Docker up, `npm install`.
- **Headless**: `npx cypress run --spec cypress/e2e/**/*.cy.ts`.
- **Interativo**: `npx cypress open`.
- **Relatórios**: Logs no terminal; bugs via GitHub Issues.
- **Frequência**: Diária em dev; semanal em prod.

## 11. Definição de Pronto

Funcionalidades são consideradas prontas se passarem em todos os testes E2E, não tiverem graves bugs e forem validadas pelo negócio.
