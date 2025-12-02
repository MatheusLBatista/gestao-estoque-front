# Plano de Teste - Módulo Movimentações

## 1. Introdução

### 1.1 Objetivo

Validar a funcionalidade completa do módulo de Movimentações em um sistema de gestão de estoque, assegurando que operações de CRUD (Criar, Ler), filtros, validações, paginação, verificação de atualização de estoque e interações com a interface funcionem corretamente. Os testes foram implementados para identificar defeitos, garantir usabilidade e conformidade com os requisitos funcionais, utilizando testes automatizados para reduzir erros manuais e aumentar a eficiência.

### 1.2 Escopo

- **Incluído**: Testes E2E para cadastro, filtros, validações de formulários, paginação, verificação de atualização de estoque e impressão de relatórios.
- **Excluído**: Testes de performance, carga, segurança avançada, integração com APIs externas (exceto mocks básicos) e testes manuais não automatizados.
- **Ferramentas**: Cypress (para execução), Docker (para ambiente), Node.js (para execução local).
- **Status**: Implementado e funcional.

### 1.3 Critérios de Aceitação

- Todos os casos de teste implementados e executando com sucesso.
- Não há falhas críticas (ex.: crashes ou dados incorretos).
- Cobertura completa dos cenários funcionais identificados.
- Validação da atualização de estoque para movimentações de entrada e saída.

## 2. Requisitos Funcionais

Os testes são baseados nos seguintes requisitos funcionais extraídos do código e da lógica da aplicação:

- **RF01**: O usuário deve poder visualizar a lista de movimentações em uma tabela paginada.
- **RF02**: O usuário deve poder cadastrar uma nova movimentação com campos obrigatórios (tipo, destino, produtos), com validações de formato e obrigatoriedade.
- **RF03**: O sistema deve permitir adicionar múltiplos produtos à movimentação, buscando por código e preenchendo automaticamente.
- **RF04**: Para movimentações de entrada, deve ser possível adicionar dados de nota fiscal.
- **RF05**: O usuário deve poder filtrar movimentações por busca, tipo ou datas, com opção de limpar filtros.
- **RF06**: O usuário deve poder navegar entre páginas e alterar o número de itens por página.
- **RF07**: O usuário deve poder imprimir detalhes de uma movimentação sem erros.
- **RF08**: O sistema deve atualizar corretamente o estoque dos produtos ao criar movimentações de entrada (aumentar) e saída (diminuir).
- **RF09**: Todas as operações devem exibir mensagens de sucesso/erro apropriadas e manter a integridade da interface.

## 3. Casos de Teste

A tabela abaixo detalha os casos de teste, mapeados aos requisitos funcionais. Cada caso inclui ID único, cenário, pré-condições, passos, resultado esperado e status (baseado na implementação atual em Cypress).

| ID   | Cenário                                   | Pré-Condições                                        | Passos                                                               | Resultado Esperado                                                | Status       | Requisito Relacionado |
| ---- | ----------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------ | --------------------- |
| CT01 | Exibir pop-up de cadastro                 | Usuário logado, página de movimentações carregada    | 1. Clicar em "Cadastrar".                                            | Modal de cadastro visível com título correto.                     | Implementado | RF02                  |
| CT02 | Exibir campos obrigatórios no cadastro    | Modal de cadastro aberto                             | 1. Verificar visibilidade dos campos (tipo, destino).                | Todos os campos obrigatórios visíveis e acessíveis.               | Implementado | RF02                  |
| CT03 | Validar campo tipo obrigatório            | Modal de cadastro aberto                             | 1. Clicar em "Salvar" sem selecionar tipo.                           | Mensagem de erro exibida.                                         | Implementado | RF02                  |
| CT04 | Validar campo destino obrigatório         | Modal de cadastro aberto                             | 1. Selecionar tipo, clicar em "Salvar" sem destino.                  | Mensagem de erro exibida.                                         | Implementado | RF02                  |
| CT05 | Validar produtos obrigatórios             | Modal de cadastro aberto                             | 1. Preencher tipo e destino, clicar em "Salvar" sem produtos.        | Mensagem de erro "Preencha todos os campos obrigatórios" exibida. | Implementado | RF02                  |
| CT06 | Adicionar produto à movimentação          | Modal de cadastro aberto                             | 1. Clicar em "Adicionar produto".                                    | Campos para produto visíveis.                                     | Implementado | RF03                  |
| CT07 | Buscar produto por código                 | Produto adicionado                                   | 1. Digitar código válido no campo.                                   | Nome preenchido automaticamente.                                  | Implementado | RF03                  |
| CT08 | Criar movimentação de entrada com sucesso | Modal de cadastro aberto                             | 1. Preencher tipo entrada, destino, produto válido, clicar "Salvar". | Movimentação criada, mensagem de sucesso exibida.                 | Implementado | RF02                  |
| CT09 | Criar movimentação de saída com sucesso   | Modal de cadastro aberto                             | 1. Preencher tipo saída, destino, produto válido, clicar "Salvar".   | Movimentação criada, mensagem de sucesso exibida.                 | Implementado | RF02                  |
| CT10 | Exibir campos de nota fiscal para entrada | Modal de cadastro aberto, tipo entrada               | 1. Selecionar tipo entrada.                                          | Campos de nota fiscal visíveis.                                   | Implementado | RF04                  |
| CT11 | Filtrar por busca                         | Página de movimentações carregada                    | 1. Digitar no campo de busca, aguardar.                              | Resultados filtrados, URL com parâmetro correto.                  | Implementado | RF05                  |
| CT12 | Filtrar por tipo                          | Página de movimentações carregada                    | 1. Selecionar tipo (ex.: entrada).                                   | Resultados filtrados, URL com "tipo=entrada".                     | Implementado | RF05                  |
| CT13 | Filtrar por data inicial                  | Página de movimentações carregada                    | 1. Selecionar data inicial.                                          | Resultados filtrados.                                             | Implementado | RF05                  |
| CT14 | Limpar filtros                            | Filtros aplicados                                    | 1. Clicar em "Limpar".                                               | Filtros removidos.                                                | Implementado | RF05                  |
| CT15 | Navegar para a próxima página             | Página de movimentações carregada, múltiplas páginas | 1. Clicar em "Próxima".                                              | Página 2 carregada, URL com "page=2".                             | Implementado | RF06                  |
| CT16 | Navegar para a página anterior            | Página 2 carregada                                   | 1. Clicar em "Anterior".                                             | Página 1 carregada, URL com "page=1".                             | Implementado | RF06                  |
| CT17 | Alterar itens por página                  | Página de movimentações carregada                    | 1. Selecionar 20 itens por página.                                   | Lista atualizada, URL com "limite=20".                            | Implementado | RF06                  |
| CT18 | Imprimir detalhes sem erros               | Página de movimentações carregada, dados presentes   | 1. Clicar na linha, clicar em "Imprimir".                            | Botão clicável, sem alertas de erro.                              | Implementado | RF07                  |
| CT19 | Verificar aumento de estoque em entrada   | Usuário logado, produto com estoque conhecido        | 1. Criar movimentação de entrada com quantidade específica.          | Estoque do produto aumentado na quantidade informada.             | Implementado | RF08                  |
| CT20 | Verificar redução de estoque em saída     | Usuário logado, produto com estoque suficiente       | 1. Criar movimentação de saída com quantidade específica.            | Estoque do produto reduzido na quantidade informada.              | Implementado | RF08                  |
| CT21 | Buscar produto por nome e selecionar      | Modal de cadastro aberto, produto adicionado         | 1. Digitar nome do produto, selecionar do dropdown.                  | Produto selecionado e código preenchido automaticamente.          | Implementado | RF03                  |
| CT22 | Exibir mensagem quando não há resultados  | Página de movimentações carregada                    | 1. Filtrar por termo inexistente.                                    | Mensagem "Nenhuma movimentação encontrada" exibida.               | Implementado | RF05                  |

## 4. Ambiente de Teste

- **Software**:
  - Navegador: Chrome (versão estável).
  - Cypress: Versão 13+.
  - Node.js: Versão 18+.
  - Docker: Para executar a API backend (porta 5011) e frontend (porta 3000).
- **Dados de Teste**: 
  - Movimentação de exemplo - Tipo: entrada/saída, Destino: "Destino Teste [timestamp]", Produto: código válido do sistema.
  - Usuários de teste: 'GER0001' / 'Gerente@123' para testes de estoque.
  - Limpeza automática via `after()` hook para movimentações criadas durante os testes.

## 5. Riscos e Mitigações

- **Risco**: Dados de teste persistindo no banco. **Mitigação**: Hook `after()` para deletar movimentações criadas.
- **Risco**: Falhas de rede/API. **Mitigação**: Intercepts no Cypress para simular respostas.
- **Risco**: Mudanças na UI quebrando seletores. **Mitigação**: Uso de `data-test` attributes.

## 6. Execução e Resultados

- **Pré-requisitos**:
  - Ambiente Docker rodando (backend na porta 5011, frontend na porta 3000).
  - Dependências instaladas: `npm install`.
  - Cypress configurado com variáveis de ambiente (FRONTEND_URL, API_URL).

- **Modo Interativo**:
  - Comando: `npx cypress open`.
  - Abre a interface do Cypress; selecione o arquivo `movimentacoes.cy.ts` para executar testes passo a passo.

- **Execução Específica**:
  - Para um teste específico: `npx cypress run --spec cypress/e2e/movimentacoes/movimentacoes.cy.ts`.

- **Status dos Testes**:
  - 22 casos de teste implementados e funcionais
  - 5 grupos de teste organizados por funcionalidade
  - Cobertura completa de todos os requisitos funcionais
  - Validação de estoque implementada para entrada e saída
