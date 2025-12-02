describe("Movimentações", () => {
  const frontendUrl = Cypress.env("FRONTEND_URL") || "http://localhost:3000";
  const apiUrl = Cypress.env("API_URL") || "http://localhost:5011";
  const matricula = "ADM0001";
  const senha = "Admin@123";

  let movimentacaoIdCriada: string;
  let authToken: string;
  const destinoMovimentacao = `Destino Teste ${Date.now()}`;
  const observacoesMovimentacao = "Observações de teste";

  beforeEach(() => {
    cy.intercept("GET", `${apiUrl}/movimentacoes*`).as("getMovimentacoes");
    cy.intercept("POST", `${apiUrl}/movimentacoes`).as("createMovimentacao");
    cy.intercept("GET", `${apiUrl}/produtos*`).as("getProdutos");

    cy.on("uncaught:exception", (err) => {
      if (
        err.message.includes(
          "ResizeObserver loop completed with undelivered notifications"
        )
      ) {
        return false;
      }
    });

    cy.login(matricula, senha);
  });

  describe("Cadastrar movimentação", () => {
    beforeEach(() => {
      cy.visit(`${frontendUrl}/movimentacoes`);
      cy.wait("@getMovimentacoes");

      cy.getByData("btn-abrir-cadastro").click();

      cy.getByData("dialog-cadastro-movimentacao").should("be.visible");
    });

    it("Deve exibir pop-up de cadastro ao clicar em cadastrar", () => {
      cy.getByData("dialog-cadastro-movimentacao").should("be.visible");
      cy.contains("Cadastro de movimentações").should("be.visible");
    });

    it("Deve exibir todos os campos obrigatórios do formulário", () => {
      cy.getByData("select-tipo").should("be.visible");
      cy.getByData("input-destino").should("be.visible");
      cy.getByData("btn-adicionar-produto").should("be.visible");
    });

    it("Deve validar campo tipo obrigatório", () => {
      cy.getByData("btn-salvar").click();

      cy.wait(500);
      cy.get('[data-test="toast-error-campos-obrigatorios"]', {
        timeout: 5000,
      }).should("exist");
      cy.getByData("dialog-cadastro-movimentacao").should("be.visible");
    });

    it("Deve validar campo destino obrigatório", () => {
      cy.getByData("select-tipo").click();
      cy.getByData("select-item-entrada").click();

      cy.getByData("btn-salvar").click();

      cy.wait(500);
      cy.get('[data-test="toast-error-campos-obrigatorios"]', {
        timeout: 5000,
      }).should("exist");
      cy.getByData("dialog-cadastro-movimentacao").should("be.visible");
    });

    it("Deve validar que pelo menos um produto é obrigatório", () => {
      cy.getByData("select-tipo").click();
      cy.getByData("select-item-entrada").click();
      cy.getByData("input-destino").type(destinoMovimentacao);

      cy.getByData("btn-salvar").click();

      cy.wait(500);
      cy.get('[data-test="toast-error-campos-obrigatorios"]', {
        timeout: 5000,
      }).should("exist");
      cy.getByData("dialog-cadastro-movimentacao").should("be.visible");
    });

    it("Deve permitir adicionar produto", () => {
      cy.getByData("btn-adicionar-produto").click();

      cy.getByData("input-codigo-0").should("be.visible");
      cy.getByData("input-nome-0").should("be.visible");
      cy.getByData("input-valor-0").scrollIntoView().should("be.visible");
      cy.getByData("input-quantidade-0").should("be.visible");
    });

    it("Deve buscar produto por código", () => {
      cy.getByData("btn-adicionar-produto").click();

      cy.getByData("input-codigo-0").type("DIS");

      cy.wait("@getProdutos");
      cy.wait(500);

      cy.getByData("input-nome-0").invoke("val").should("not.be.empty");
    });

    it("Deve buscar produto por nome e selecionar do dropdown", () => {
      cy.getByData("btn-adicionar-produto").click();

      cy.getByData("search-wrapper-0").should("be.visible");
      cy.getByData("input-nome-0").type("Algodão");

      cy.wait("@getProdutos");
      cy.wait(500);

      cy.get('[data-test^="product-search-item-0-"]').first().click();

      cy.getByData("input-nome-0").should("have.class", "bg-gray-100");
      cy.getByData("input-codigo-0").invoke("val").should("not.be.empty");
    });

    it("Deve criar movimentação de entrada com sucesso", () => {
      cy.getByData("select-tipo").click();
      cy.getByData("select-item-entrada").click();
      cy.getByData("input-destino").type(destinoMovimentacao);
      cy.getByData("textarea-observacoes").type(observacoesMovimentacao);

      cy.getByData("btn-adicionar-produto").click();

      cy.getByData("input-nome-0").type("Algodão");
      cy.wait("@getProdutos");
      cy.wait(500);

      cy.get('[data-test^="product-search-item-0-"]').first().click();

      cy.getByData("input-valor-0").type("100");
      cy.getByData("input-quantidade-0").type("10");

      cy.getByData("btn-salvar").click();

      cy.wait("@createMovimentacao").then((createInterception) => {
        expect(createInterception.response?.statusCode).to.eq(201);
        movimentacaoIdCriada = createInterception.response?.body._id;
      });

      cy.getByData("dialog-cadastro-movimentacao").should("not.exist");
      cy.contains("Movimentação cadastrada com sucesso!").should("be.visible");
    });

    it("Deve criar movimentação de saída com sucesso", () => {
      cy.getByData("select-tipo").click();
      cy.getByData("select-item-saida").click();
      cy.getByData("input-destino").type(destinoMovimentacao);
      cy.getByData("textarea-observacoes").type(observacoesMovimentacao);

      cy.getByData("btn-adicionar-produto").click();

      cy.getByData("input-nome-0").type("Algodão");
      cy.wait("@getProdutos");
      cy.wait(500);

      cy.get('[data-test^="product-search-item-0-"]').first().click();

      cy.getByData("input-valor-0").type("299.99");
      cy.getByData("input-quantidade-0").type("10");

      cy.getByData("btn-salvar").click();

      cy.wait("@createMovimentacao");

      cy.getByData("dialog-cadastro-movimentacao").should("not.exist");
      cy.contains("Movimentação cadastrada com sucesso!").should("be.visible");
    });

    it("Deve exibir campos de nota fiscal para entrada", () => {
      cy.getByData("select-tipo").click();
      cy.getByData("select-item-entrada").click();

      cy.getByData("input-nf-numero").should("be.visible");
      cy.getByData("input-nf-serie").should("be.visible");
      cy.getByData("input-nf-chave").should("be.visible");
      cy.getByData("input-nf-data").should("be.visible");
    });
  });

  describe("Verificar atualização de estoque", () => {
    let produtoId: string;
    let estoqueInicial: number;

    it("Deve aumentar o estoque ao criar movimentação de entrada", () => {
      cy.request({
        method: "POST",
        url: `${apiUrl}/login`,
        body: {
          matricula: 'GER0001',
          senha: 'Gerente@123',
        },
      }).then((loginResponse) => {
        const authToken = loginResponse.body.accessToken;

        cy.request({
          method: "GET",
          url: `${apiUrl}/produtos`,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }).then((response) => {
          console.log(response);
          const produto = response.body.data.docs[0];
          produtoId = produto._id;
          estoqueInicial = produto.estoque || 0;

          cy.visit(`${frontendUrl}/movimentacoes`);
          cy.wait("@getMovimentacoes");

          cy.getByData("btn-abrir-cadastro").click();
          cy.getByData("dialog-cadastro-movimentacao").should("be.visible");

          cy.getByData("select-tipo").click();
          cy.getByData("select-item-entrada").click();
          cy.getByData("input-destino").type(destinoMovimentacao);

          cy.getByData("btn-adicionar-produto").click();

          cy.getByData("input-codigo-0").type(produto.codigo_produto);
          cy.wait("@getProdutos");
          cy.wait(1000);

          const quantidadeEntrada = 10;
          cy.getByData("input-valor-0").type("100");
          cy.getByData("input-quantidade-0").type(String(quantidadeEntrada));

          cy.getByData("btn-salvar").click();

          cy.wait("@createMovimentacao").then((createInterception) => {
            expect(createInterception.response?.statusCode).to.eq(201);

            cy.request({
              method: "GET",
              url: `${apiUrl}/produtos/${produtoId}`,
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }).then((produtoResponse) => {
              const estoqueAtual = produtoResponse.body.data.estoque;
              console.log(estoqueAtual);
              expect(estoqueAtual).to.eq(estoqueInicial + quantidadeEntrada);
            });
          });
        });
      });
    });

    it("Deve diminuir o estoque ao criar movimentação de saída", () => {
      cy.request({
        method: "POST",
        url: `${apiUrl}/login`,
        body: {
          matricula: 'GER0001',
          senha: 'Gerente@123',
        },
      }).then((loginResponse) => {
        const authToken = loginResponse.body.accessToken;

        cy.request({
          method: "GET",
          url: `${apiUrl}/produtos`,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }).then((response) => {
          const produto = response.body.data.docs.find(
            (p: any) => (p.estoque || 0) > 10
          );

          if (!produto) {
            cy.log("Nenhum produto com estoque suficiente encontrado");
            return;
          }

          produtoId = produto._id;
          estoqueInicial = produto.estoque || 0;

          cy.visit(`${frontendUrl}/movimentacoes`);
          cy.wait("@getMovimentacoes");

          cy.getByData("btn-abrir-cadastro").click();
          cy.getByData("dialog-cadastro-movimentacao").should("be.visible");

          cy.getByData("select-tipo").click();
          cy.getByData("select-item-saida").click();
          cy.getByData("input-destino").type(destinoMovimentacao);

          cy.getByData("btn-adicionar-produto").click();

          cy.getByData("input-codigo-0").type(produto.codigo_produto);
          cy.wait("@getProdutos");
          cy.wait(1000);

          const quantidadeSaida = 5;
          cy.getByData("input-valor-0").type("150");
          cy.getByData("input-quantidade-0").type(String(quantidadeSaida));

          cy.getByData("btn-salvar").click();

          cy.wait("@createMovimentacao").then((createInterception) => {
            expect(createInterception.response?.statusCode).to.eq(201);

            cy.request({
              method: "GET",
              url: `${apiUrl}/produtos/${produtoId}`,
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }).then((produtoResponse) => {
              const estoqueAtual = produtoResponse.body.data.estoque;
              console.log(estoqueAtual);
              expect(estoqueAtual).to.eq(estoqueInicial - quantidadeSaida);
            });
          });
        });
      });
    });
  });

  describe("Filtrar movimentações", () => {
    beforeEach(() => {
      cy.visit(`${frontendUrl}/movimentacoes`);
      cy.wait("@getMovimentacoes");
    });

    it("Deve filtrar movimentações por busca", () => {
      cy.getByData("input-busca-movimentacao").type("Destino Teste{enter}");

      cy.wait("@getMovimentacoes").then((interception) => {
        expect(interception.request.url).to.include(
          "movimentacao=Destino+Teste"
        );
      });

      cy.get("tbody tr").first().click();
      cy.getByData("dialog-listagem-movimentacao").should("be.visible");
      cy.contains("Destino Teste").should("be.visible");
    });

    it("Deve filtrar movimentações por tipo", () => {
      cy.getByData("select-tipo-movimentacao").click();
      cy.getByData("select-item-entrada").click();

      cy.wait("@getMovimentacoes").then((interception) => {
        expect(interception.request.url).to.include("tipo=");
      });

      cy.get("tbody tr").first().click();
      cy.getByData("dialog-listagem-movimentacao").should("be.visible");
      cy.contains("Entrada").should("be.visible");
    });

    it("Deve filtrar movimentações por data inicial e final", () => {
      cy.getByData("calendar-data-inicial").click();
      cy.get(".rdp-day").eq(5).click();

      cy.getByData("calendar-data-final").click();
      cy.get(".rdp-day").eq(10).click();

      cy.wait("@getMovimentacoes").then((interception) => {
        expect(interception.request.url).to.include("data_inicio=");
        expect(interception.request.url).to.include("data_fim=");
      });
    });

    it("Deve exibir mensagem quando nenhuma movimentação for encontrada", () => {
      cy.getByData("input-busca-movimentacao").type(
        "MovimentacaoInexistente123{enter}"
      );

      cy.wait("@getMovimentacoes").then((interception) => {
        expect(interception.request.url).to.include(
          "movimentacao=MovimentacaoInexistente123"
        );
      });

      cy.wait(500);
      cy.contains("Nenhuma movimentação encontrada", { timeout: 5000 }).should(
        "exist"
      );
    });

    it("Deve limpar filtros de movimentações", () => {
      cy.getByData("input-busca-movimentacao").type("teste{enter}");

      cy.wait("@getMovimentacoes").then((interception) => {
        expect(interception.request.url).to.include("movimentacao=");
      });

      cy.getByData("btn-limpar-filtros-movimentacao")
        .should("be.visible")
        .click();

      cy.getByData("input-busca-movimentacao").should("have.value", "");

      cy.wait("@getMovimentacoes").then((interception) => {
        expect(interception.request.url).to.not.include("tipo=");
        expect(interception.request.url).to.not.include("movimentacao=");
        expect(interception.request.url).to.not.include("data_inicio=");
        expect(interception.request.url).to.not.include("data_fim=");
      });
    });
  });

  describe("Paginação de movimentações", () => {
    beforeEach(() => {
      cy.visit(`${frontendUrl}/movimentacoes`);
      cy.wait("@getMovimentacoes");
    });

    it("Deve navegar para a próxima página", () => {
      cy.getByData("btn-proxima-pagina").should("be.visible").click();

      cy.wait("@getMovimentacoes").then((interception) => {
        expect(interception.request.url).to.include("page=2");
      });
    });

    it("Deve navegar para a página anterior", () => {
      cy.getByData("btn-proxima-pagina").click();
      cy.wait("@getMovimentacoes");

      cy.getByData("btn-pagina-anterior").click();

      cy.wait("@getMovimentacoes").then((interception) => {
        expect(interception.request.url).to.include("page=1");
      });
    });

    it("Deve alterar o número de itens por página", () => {
      cy.getByData("select-itens-por-pagina").click();
      cy.getByData("select-item-20").click();

      cy.wait("@getMovimentacoes").then((interception) => {
        const url = new URL(interception.request.url);
        expect(url.searchParams.get("limite")).to.eq("20");
      });
    });
  });

  describe("Imprimir movimentações", () => {
    beforeEach(() => {
      cy.visit(`${frontendUrl}/movimentacoes`);
      cy.wait("@getMovimentacoes");
    });

    it("Deve permitir clicar no botão de impressão sem erros", () => {
      cy.get("tbody tr").first().click();
      cy.getByData("dialog-listagem-movimentacao").should("be.visible");

      cy.getByData("btn-imprimir-movimentacao").click();

      cy.getByData("dialog-listagem-movimentacao").should("be.visible");
    });
  });

  after(() => {
    if (movimentacaoIdCriada) {
      cy.request({
        method: "DELETE",
        url: `${apiUrl}/movimentacoes/${movimentacaoIdCriada}`,
        failOnStatusCode: false,
      });
    }
  });
});