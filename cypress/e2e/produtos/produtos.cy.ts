describe("Produtos", () => {
  const frontendUrl = Cypress.env("FRONTEND_URL") || "http://localhost:3000";
  const apiUrl = Cypress.env("API_URL") || "http://localhost:5011";
  const matricula = "ADM0001";
  const senha = "Admin@123";

  let produtoIdCriado: string;
  const nomeProduto = `Produto Teste ${Date.now()}`;
  const codigoProduto = `TEST${Date.now()}`;

  beforeEach(() => {
    cy.intercept("GET", `${apiUrl}/produtos*`).as("getProdutos");
    cy.intercept("POST", `${apiUrl}/produtos`).as("createProduto");
    cy.intercept("PATCH", `${apiUrl}/produtos/*`).as("patchProduto");
    cy.intercept("DELETE", `${apiUrl}/produtos/*`).as("deleteProduto");

    cy.login(matricula, senha);
  });

  describe.skip("Cadastrar produto", () => {
    beforeEach(() => {
      cy.visit(`${frontendUrl}/produtos`);
      cy.wait("@getProdutos");

      cy.getByData("btn-abrir-cadastro").click();

      cy.getByData("dialog-cadastro-produto").should("be.visible");
    });

    it("Deve exibir pop-up de cadastro ao clicar em cadastrar", () => {
      cy.getByData("dialog-cadastro-produto").should("be.visible");
      cy.contains("Cadastro de produto").should("be.visible");
    });

    it("Deve exibir todos os campos obrigatórios do formulário", () => {
      cy.getByData("input-nome-produto").scrollIntoView().should("be.visible");
      cy.getByData("select-fornecedor").scrollIntoView().should("be.visible");
      cy.getByData("input-marca").scrollIntoView().should("be.visible");
      cy.getByData("input-codigo-produto")
        .scrollIntoView()
        .should("be.visible");
      cy.getByData("input-estoque-min").scrollIntoView().should("be.visible");
      cy.getByData("input-preco").scrollIntoView().should("be.visible");
      cy.getByData("textarea-descricao").scrollIntoView().should("be.visible");
    });

    it("Deve validar campo nome obrigatório", () => {
      cy.getByData("btn-salvar").click();

      cy.wait(500);
      cy.getByData("dialog-cadastro-produto").should("be.visible");
      cy.contains("Informe pelo menos 2 caracteres").should("be.visible");
    });

    it("Deve validar campo fornecedor obrigatório", () => {
      cy.getByData("input-nome-produto").type("Produto Teste");

      cy.getByData("btn-salvar").click();

      cy.wait(500);
      cy.getByData("dialog-cadastro-produto").should("be.visible");
      cy.contains("Selecione um fornecedor").should("be.visible");
    });

    it("Deve validar campo marca obrigatório", () => {
      cy.getByData("input-nome-produto").type("Produto Teste");
      cy.getByData("select-fornecedor").click();
      cy.getByData("select-item").first().click();

      cy.getByData("btn-salvar").click();

      cy.wait(500);
      cy.contains("Informe pelo menos 2 caracteres").should("be.visible");
      cy.getByData("dialog-cadastro-produto").should("be.visible");
    });

    it("Deve validar campo código obrigatório", () => {
      cy.getByData("input-nome-produto").type("Produto Teste");
      cy.getByData("select-fornecedor").click();
      cy.getByData("select-item").first().click();
      cy.getByData("input-marca").type("Marca Teste");

      cy.getByData("btn-salvar").click();

      cy.wait(500);
      cy.contains("Informe pelo menos 2 caracteres").should("be.visible");
      cy.getByData("dialog-cadastro-produto").should("be.visible");
    });

    it("Deve validar campo estoque mínimo obrigatório", () => {
      cy.getByData("input-nome-produto").type("Produto Teste");
      cy.getByData("select-fornecedor").click();
      cy.getByData("select-item").first().click();
      cy.getByData("input-marca").type("Marca Teste");
      cy.getByData("input-codigo-produto").type("TEST123");

      cy.getByData("btn-salvar").click();

      cy.wait(500);
      cy.contains("Estoque mínimo é obrigatório").should("be.visible");
      cy.getByData("dialog-cadastro-produto").should("be.visible");
    });

    it("Deve validar campo preço obrigatório", () => {
      cy.getByData("input-nome-produto").type("Produto Teste");
      cy.getByData("select-fornecedor").click();
      cy.getByData("select-item").first().click();
      cy.getByData("input-marca").type("Marca Teste");
      cy.getByData("input-codigo-produto").type("TEST123");
      cy.getByData("input-estoque-min").type("10");

      cy.getByData("btn-salvar").click();

      cy.wait(500);
      cy.contains("Preço é obrigatório").should("be.visible");
      cy.getByData("dialog-cadastro-produto").should("be.visible");
    });

    it("Deve validar campo descrição obrigatório", () => {
      cy.getByData("input-nome-produto").type("Produto Teste");
      cy.getByData("select-fornecedor").click();
      cy.getByData("select-item").first().click();
      cy.getByData("input-marca").type("Marca Teste");
      cy.getByData("input-codigo-produto").type("TEST123");
      cy.getByData("input-estoque-min").type("10");
      cy.getByData("input-preco").type("100");

      cy.getByData("btn-salvar").click();

      cy.contains("A descrição deve ter pelo menos 10 caracteres")
        .scrollIntoView()
        .should("be.visible");
      cy.getByData("dialog-cadastro-produto").should("be.visible");
    });

    it("Deve criar produto com sucesso com dados válidos", () => {
      cy.getByData("input-nome-produto").type(nomeProduto);
      cy.getByData("select-fornecedor").click();
      cy.getByData("select-item").first().click();
      cy.getByData("input-marca").type("Marca Teste");
      cy.getByData("input-codigo-produto").type(codigoProduto);
      cy.getByData("input-estoque-min").type("10");
      cy.getByData("input-preco").type("100");
      cy.getByData("textarea-descricao").type("Descrição do produto teste");

      cy.getByData("btn-salvar").click();

      cy.wait("@createProduto").then((createInterception) => {
        expect(createInterception.response?.statusCode).to.eq(201);
        expect(createInterception.response?.body).to.have.property("data");
        produtoIdCriado = createInterception.response?.body.data._id;
        expect(createInterception.response?.body?.data?.nome_produto).to.equal(
          nomeProduto
        );
        expect(
          createInterception.response?.body?.data?.codigo_produto
        ).to.equal(codigoProduto);
      });

      cy.getByData("dialog-cadastro-produto").should("not.exist");
      cy.contains("Produto cadastrado com sucesso!").should("be.visible");
    });

    it.skip("Deve dar erro ao criar produto com código duplicado", () => {
      const nome = `Produto Teste ${Date.now()}`;

      cy.getByData("input-nome-produto").type(nome);
      cy.getByData("select-fornecedor").click();
      cy.getByData("select-item").first().click();
      cy.getByData("input-marca").type("Marca Teste");
      cy.getByData("input-codigo-produto").type(codigoProduto);
      cy.getByData("input-estoque-min").type("10");
      cy.getByData("input-preco").type("100");
      cy.getByData("textarea-descricao").type("Descrição do produto teste");

      cy.getByData("btn-salvar").scrollIntoView().click();

      cy.wait("@createProduto").then((createInterception) => {
        expect(createInterception.response?.statusCode).to.eq(400);
        console.log(createInterception.response?.body);
        expect(createInterception.response?.body?.message).to.equal(
          "Já existe um produto com este código."
        );
      });

      cy.getByData("dialog-cadastro-produto").should("be.visible");
    });
  });

  describe.skip("Editar produto", () => {
    let primeiroProduto: any;

    beforeEach(() => {
      cy.visit(`${frontendUrl}/produtos`);
      cy.wait("@getProdutos");
    });

    it("Deve redirecionar para o pop-up de edição ao clicar em editar", () => {
      cy.get("tbody tr").first().click();
      cy.getByData("dialog-listagem-produto").should("be.visible");

      cy.getByData("btn-editar-produto").click();
      cy.getByData("dialog-edicao-produto").should("be.visible");
    });

    it("Deve atualizar produto com sucesso", () => {
      cy.get("tbody tr").first().click();
      cy.getByData("dialog-listagem-produto").should("be.visible");
      cy.getByData("btn-editar-produto").click();

      cy.getByData("dialog-edicao-produto").should("be.visible");

      cy.getByData("input-preco").clear().type("150");
      cy.getByData("textarea-descricao").clear().type("Descrição atualizada");

      cy.getByData("btn-salvar").click();

      cy.wait("@patchProduto").then((patchInterception) => {
        expect(patchInterception.response?.statusCode).to.eq(200);
        expect(patchInterception.response?.body).to.have.property("data");
        expect(patchInterception.response?.body?.data?.preco).to.equal(150);
        expect(patchInterception.response?.body?.data?.descricao).to.equal(
          "Descrição atualizada"
        );
      });

      cy.getByData("dialog-edicao-produto").should("not.exist");
    });

    it("Deve manter mesmas validações do cadastro", () => {
      cy.get("tbody tr").first().click();
      cy.getByData("dialog-listagem-produto").should("be.visible");

      cy.getByData("btn-editar-produto").click();
      cy.getByData("dialog-edicao-produto").should("be.visible");

      cy.getByData("input-preco").clear();

      cy.getByData("btn-salvar").click();

      cy.wait(500);
      cy.contains("Preço é obrigatório").should("be.visible");
      cy.getByData("dialog-edicao-produto").should("be.visible");
    });
  });

  describe.skip("Filtrar produtos", () => {
    beforeEach(() => {
      cy.visit(`${frontendUrl}/produtos`);
      cy.wait("@getProdutos");
    });

    it("Deve filtrar produtos por nome", () => {
      cy.getByData("input-busca-produto").type(nomeProduto).type("{enter}");

      cy.wait("@getProdutos").then((interception) => {
        const url = new URL(interception.request.url);
        expect(url.searchParams.get("produto")).to.eq(nomeProduto);
      });

      cy.contains(nomeProduto).should("be.visible");
    });

    it("Deve filtrar produtos por categoria", () => {
      cy.getByData("select-categoria").click();
      cy.getByData("select-item-a").click();

      cy.wait("@getProdutos").then((interception) => {
        const url = new URL(interception.request.url);
        expect(url.searchParams.get("categoria")).to.eq("a");
      });

      cy.getByData("select-categoria").click();
      cy.getByData("select-item-b").click();

      cy.wait("@getProdutos").then((interception) => {
        const url = new URL(interception.request.url);
        expect(url.searchParams.get("categoria")).to.eq("b");
      });

      cy.getByData("select-categoria").click();
      cy.getByData("select-item-c").click();

      cy.wait("@getProdutos").then((interception) => {
        const url = new URL(interception.request.url);
        expect(url.searchParams.get("categoria")).to.eq("c");
      });
    });

    it("Deve filtrar produtos por estoque baixo", () => {
      cy.getByData("switch-estoque-baixo").click();

      cy.wait("@getProdutos").then((interception) => {
        const url = new URL(interception.request.url);
        expect(url.searchParams.get("estoque_baixo")).to.eq("true");
      });
    });

    it("Deve limpar filtros de produtos", () => {
      cy.getByData("input-busca-produto").type(nomeProduto);
      cy.getByData("btn-limpar-filtros").click();

      cy.getByData("select-categoria").click();
      cy.getByData("select-item-a").click();
      cy.getByData("btn-limpar-filtros").click();

      cy.getByData("switch-estoque-baixo").click();
      cy.getByData("btn-limpar-filtros").click();

      cy.wait("@getProdutos").then((interception) => {
        const url = new URL(interception.request.url);
        expect(url.searchParams.get("produto")).to.not.be;
        expect(url.searchParams.get("estoque_baixo")).to.be.null;
      });
    });
  });

  describe("Paginação de produtos", () => {
    beforeEach(() => {
      cy.visit(`${frontendUrl}/produtos`);
      cy.wait("@getProdutos");
    });

    it.skip("Deve navegar para a próxima página", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-test="btn-proxima-pagina"]').length > 0) {
          cy.getByData("btn-proxima-pagina").should(
            "not.have.class",
            "opacity-50"
          );

          cy.getByData("btn-proxima-pagina").click();

          cy.wait("@getProdutos").then((interception) => {
            const url = new URL(interception.request.url);
            expect(url.searchParams.get("page")).to.eq("2");
          });
        } else {
          cy.log("Não há múltiplas páginas para testar navegação");
        }
      });
    });

    it.skip("Deve navegar para a página anterior", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find('[data-test="btn-proxima-pagina"]').length > 0 &&
          !$body.find('[data-test="btn-proxima-pagina"]').hasClass("opacity-50")
        ) {
          cy.getByData("btn-proxima-pagina").click();
          cy.wait("@getProdutos");

          cy.getByData("btn-pagina-anterior").should(
            "not.have.class",
            "opacity-50"
          );
          cy.getByData("btn-pagina-anterior").click();

          cy.wait("@getProdutos").then((interception) => {
            const url = new URL(interception.request.url);
            expect(url.searchParams.get("page")).to.eq("1");
          });
        } else {
          cy.log("Não há múltiplas páginas para testar navegação");
        }
      });
    });

    it("Deve alterar o número de itens por página", () => {
      cy.getByData("select-itens-por-pagina").click();
      cy.getByData("select-item-20").click();

      cy.wait("@getProdutos").then((interception) => {
        const url = new URL(interception.request.url);
        expect(url.searchParams.get("limite")).to.eq("20");
      });
    });
  });

  describe.skip("Imprimir produtos", () => {
    beforeEach(() => {
      cy.visit(`${frontendUrl}/produtos`);
      cy.wait("@getProdutos");
    });

    it("Deve permitir clicar no botão de impressão sem erros", () => {
      cy.getByData("btn-imprimir").click();

      cy.wait(1000);
      cy.get("body").should("be.visible");
    });
  });

  after(() => {
    cy.request({
      method: "DELETE",
      url: `${apiUrl}/produtos/${produtoIdCriado}`,
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      failOnStatusCode: false,
    }).then(() => {
      cy.log(`Produto de teste ${produtoIdCriado} removido`);
    });
  });
});
