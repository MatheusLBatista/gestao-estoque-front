describe("Fornecedores", () => {
  const frontendUrl = Cypress.env("FRONTEND_URL") || "http://localhost:3000";
  const apiUrl = Cypress.env("API_URL") || "http://localhost:5011";
  const matricula = "ADM0001";
  const senha = "Admin@123";

  let fornecedorIdCriado: string;
  const nomeFornecedor = `Fornecedor Teste ${Date.now()}`;
  const emailFornecedor = `teste${Date.now()}@empresa.com`;
  const cnpjFornecedor = `12.345.678/${String(Date.now()).slice(-4)}-90`;

  beforeEach(() => {
    cy.intercept("GET", `${apiUrl}/fornecedores*`).as("getFornecedores");
    cy.intercept("POST", `${apiUrl}/fornecedores`).as("createFornecedor");
    cy.intercept("PATCH", `${apiUrl}/fornecedores/*`).as("patchFornecedor");

    cy.login(matricula, senha);
  });

  describe("Cadastrar fornecedor", () => {
    beforeEach(() => {
      cy.visit(`${frontendUrl}/fornecedores`);
      cy.wait("@getFornecedores");

      cy.getByData("btn-abrir-cadastro").click();

      cy.getByData("dialog-cadastro-fornecedor").should("be.visible");
    });

    it("Deve exibir pop-up de cadastro ao clicar em cadastrar", () => {
      cy.getByData("dialog-cadastro-fornecedor").should("be.visible");
      cy.contains("Cadastro de fornecedor").should("be.visible");
    });

    it("Deve exibir todos os campos obrigatórios do formulário", () => {
      cy.getByData("input-nome-fornecedor")
        .scrollIntoView()
        .should("be.visible");
      cy.getByData("input-cnpj").scrollIntoView().should("be.visible");
      cy.getByData("input-telefone").scrollIntoView().should("be.visible");
      cy.getByData("input-email").scrollIntoView().should("be.visible");
      cy.getByData("input-cep").scrollIntoView().should("be.visible");
      cy.getByData("input-logradouro").scrollIntoView().should("be.visible");
      cy.getByData("select-estado").scrollIntoView().should("be.visible");
    });

    it("Deve validar campo nome obrigatório", () => {
      cy.getByData("btn-salvar").click();

      cy.wait(500);
      cy.getByData("dialog-cadastro-fornecedor").should("be.visible");
      cy.contains("Informe pelo menos 2 caracteres").should("be.visible");
    });

    it("Deve validar campo CNPJ obrigatório", () => {
      cy.getByData("input-nome-fornecedor").type("Fornecedor Teste");

      cy.getByData("btn-salvar").click();

      cy.wait(500);
      cy.getByData("dialog-cadastro-fornecedor").should("be.visible");
      cy.contains("CNPJ inválido").should("be.visible");
    });

    it("Deve validar formato do CNPJ", () => {
      cy.getByData("input-nome-fornecedor").type("Fornecedor Teste");
      cy.getByData("input-cnpj").type("123456789");

      cy.getByData("btn-salvar").click();

      cy.wait(500);
      cy.contains("CNPJ inválido").should("be.visible");
      cy.getByData("dialog-cadastro-fornecedor").should("be.visible");
    });

    it("Deve validar formato do email", () => {
      cy.getByData("input-nome-fornecedor").type("Fornecedor Teste");
      cy.getByData("input-cnpj").type("12.345.678/0001-90");
      cy.getByData("input-email").type("emailinvalido");

      cy.getByData("btn-salvar").click();

      cy.wait(500);
      cy.contains("Email inválido").should("be.visible");
      cy.getByData("dialog-cadastro-fornecedor").should("be.visible");
    });

    it("Deve validar quantidade mínima de caracteres do nome", () => {
      cy.getByData("input-nome-fornecedor").type("A");

      cy.getByData("btn-salvar").scrollIntoView().click();

      cy.wait(500);
      cy.getByData("dialog-cadastro-fornecedor").should("be.visible");
      cy.contains("Informe pelo menos 2 caracteres").should("be.visible");
    });

    it("Deve criar fornecedor com sucesso com dados válidos", () => {
      cy.getByData("input-nome-fornecedor").type(nomeFornecedor);
      cy.getByData("input-cnpj").type(cnpjFornecedor);
      cy.getByData("input-telefone").type("(11) 99999-9999");
      cy.getByData("input-email").type(emailFornecedor);
      cy.getByData("input-cep").type("76987384");
      cy.getByData("input-logradouro").type("Rua Teste, 123");

      cy.getByData("btn-salvar").click();

      cy.wait("@createFornecedor").then((createInterception) => {
        expect(createInterception.response?.statusCode).to.equal(201);
        console.log(createInterception.response?.body);

        fornecedorIdCriado = createInterception.response?.body?.data?._id;

        expect(fornecedorIdCriado).to.exist;
        expect(
          createInterception.response?.body?.data?.nome_fornecedor
        ).to.equal(nomeFornecedor);
        expect(createInterception.response?.body?.data?.cnpj).to.equal(
          cnpjFornecedor
        );
        expect(createInterception.response?.body?.data?.email).to.equal(
          emailFornecedor
        );
        cy.contains("Fornecedor cadastrado com sucesso!").should("be.visible");
      });
    });

    it("Deve dar erro ao criar fornecedor com CNPJ duplicado", () => {
      const nome = `Fornecedor Teste ${Date.now()}`;
      const email = `teste${Date.now()}@empresa.com`;

      cy.getByData("input-nome-fornecedor").type(nome);
      cy.getByData("input-cnpj").type(cnpjFornecedor);
      cy.getByData("input-telefone").type("(11) 99999-9999");
      cy.getByData("input-email").type(email);
      cy.getByData("input-cep").type("76987384");
      cy.getByData("input-logradouro").type("Rua Teste, 123");

      cy.getByData("btn-salvar").scrollIntoView().click();

      cy.wait("@createFornecedor").then((createInterception) => {
        expect(createInterception.response?.statusCode).to.equal(400);
        console.log(createInterception.response?.body);

        cy.getByData("input-cnpj").scrollIntoView().should("be.visible");
        cy.contains("CNPJ já está cadastrado no sistema").should("be.visible");
        expect(createInterception.response?.body?.message).to.equal(
          "CNPJ já está cadastrado no sistema."
        );
        cy.getByData("dialog-cadastro-fornecedor").should("be.visible");
      });
    });

    it("Deve dar erro ao criar fornecedor com email duplicado", () => {
      const nome = `Fornecedor Teste ${Date.now()}`;
      const cnpj = `12.345.678/${String(Date.now()).slice(-4)}-90`;

      cy.getByData("input-nome-fornecedor").type(nome);
      cy.getByData("input-cnpj").type(cnpj);
      cy.getByData("input-telefone").type("(11) 99999-9999");
      cy.getByData("input-email").type(emailFornecedor);
      cy.getByData("input-cep").type("76987384");
      cy.getByData("input-logradouro").type("Rua Teste, 123");

      cy.getByData("btn-salvar").scrollIntoView().click();

      cy.wait("@createFornecedor").then((createInterception) => {
        expect(createInterception.response?.statusCode).to.equal(400);
        console.log(createInterception.response?.body);

        cy.getByData("input-cnpj").scrollIntoView().should("be.visible");
        cy.contains("Email já está cadastrado no sistema").should("be.visible");
        expect(createInterception.response?.body?.message).to.equal(
          "Email já está cadastrado no sistema."
        );
        cy.getByData("dialog-cadastro-fornecedor").should("be.visible");
      });
    });
  });

  describe("Editar fornecedor", () => {
    let primeiroFornecedor: any;

    beforeEach(() => {
      cy.visit(`${frontendUrl}/fornecedores`);
      cy.wait("@getFornecedores");
    });

    it("Deve redirecionar para o pop-up de edição ao clicar em editar", () => {
      cy.getByData("tabela-fornecedores").find("tbody tr").first().click();
      cy.getByData("btn-editar-fornecedor").click();

      cy.getByData("dialog-edicao-fornecedor").should("be.visible");
    });

    it("Deve atualizar fornecedor com sucesso", () => {
      const novoNome = `Fornecedor Atualizado ${Date.now()}`;

      cy.getByData("tabela-fornecedores").find("tbody tr").first().click();
      cy.getByData("btn-editar-fornecedor").click();

      cy.getByData("input-nome-fornecedor").clear().type(novoNome);

      cy.getByData("btn-salvar").click();

      cy.wait("@patchFornecedor", { timeout: 10000 }).then((interception) => {
        expect(interception.response?.statusCode).to.be.oneOf([200, 201]);
        console.log(interception.response?.body);

        cy.contains("Fornecedor atualizado com sucesso").should("be.visible");

        expect(interception.response?.body?.data?.nome_fornecedor).to.equal(
          novoNome
        );
      });
    });

    it("Deve manter mesmas validações do cadastro", () => {
      cy.getByData("tabela-fornecedores").find("tbody tr").first().click();
      cy.getByData("btn-editar-fornecedor").click();

      cy.getByData("input-nome-fornecedor").clear();

      cy.getByData("btn-salvar").click();

      cy.wait(500);
      cy.getByData("dialog-edicao-fornecedor").should("be.visible");
    });
  });

  describe("Desativar fornecedor", () => {
    it("Deve exibir detalhes do fornecedor ao clicar na linha", () => {
      cy.visit(`${frontendUrl}/fornecedores`);
      cy.wait("@getFornecedores");

      cy.getByData("tabela-fornecedores").find("tbody tr").first().click();

      cy.getByData("dialog-listagem-fornecedor").should("be.visible");
    });

    it("Deve desativar fornecedor com confirmação", () => {
      cy.visit(`${frontendUrl}/fornecedores`);
      cy.wait("@getFornecedores");

      cy.getByData("tabela-fornecedores").find("tbody tr").first().click();
      cy.getByData("btn-excluir-fornecedor").click();
      cy.getByData("btn-confirmar-excluir").click();

      cy.wait("@patchFornecedor").then((interception) => {
        expect(interception.response?.statusCode).to.equal(200);

        cy.contains("Fornecedor desativado com sucesso").should("be.visible");
      });
    });
  });

  describe("Filtrar fornecedores", () => {
    it("Deve filtrar fornecedores por nome", () => {
      cy.visit(`${frontendUrl}/fornecedores`);
      cy.wait("@getFornecedores");

      cy.getByData("input-busca-fornecedor").type("Fornecedor");
      cy.getByData("input-busca-fornecedor").type("{enter}");

      cy.wait("@getFornecedores").then((interception) => {
        expect(interception.request.url).to.include(
          "nome_fornecedor=Fornecedor"
        );
      });

      cy.getByData("tabela-fornecedores")
        .find("tbody tr")
        .should("have.length.greaterThan", 0);
    });

    it("Deve filtrar fornecedores por status", () => {
      cy.visit(`${frontendUrl}/fornecedores`);
      cy.wait("@getFornecedores");

      cy.getByData("select-status-fornecedor").click();

      cy.getByData("select-item-inativo").click();

      cy.wait("@getFornecedores").then((interception) => {
        expect(interception.request.url).to.include("status=false");
      });

      cy.getByData("tabela-fornecedores")
        .find("tbody tr")
        .should("have.length.greaterThan", 0);
    });

    it("Deve limpar filtros de fornecedores", () => {
      cy.visit(`${frontendUrl}/fornecedores`);
      cy.wait("@getFornecedores");

      cy.getByData("btn-limpar-filtro").click();

      cy.wait("@getFornecedores").then((interception) => {
        expect(interception.request.url).to.not.include("status=");
        expect(interception.request.url).to.not.include("nome_fornecedor=");
      });

      cy.getByData("tabela-fornecedores")
        .find("tbody tr")
        .should("have.length.greaterThan", 0);
    });
  });

  describe("Imprimir fornecedores", () => {
    it("Deve permitir clicar no botão de impressão sem erros", () => {
      cy.visit(`${frontendUrl}/fornecedores`);
      cy.wait("@getFornecedores");

      cy.getByData("tabela-fornecedores")
        .find("tbody tr")
        .should("have.length.greaterThan", 0);

      cy.getByData("btn-imprimir")
        .should("be.visible")
        .and("not.be.disabled")
        .click();

      cy.on("window:alert", (text) => {
        expect(text).to.not.include("Não há dados para imprimir"); 
      });

      cy.getByData("tabela-fornecedores").should("be.visible"); 
    });
  });

  after(() => {
    if (fornecedorIdCriado) {
      cy.request({
        method: "DELETE",
        url: `${apiUrl}/fornecedores/${fornecedorIdCriado}`,
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
        failOnStatusCode: false,
      }).then(() => {
        cy.log(`Fornecedor de teste ${fornecedorIdCriado} removido`);
      });
    }
  });
});
