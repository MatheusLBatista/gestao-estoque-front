describe("Funcionários", () => {
  const frontendUrl = Cypress.env("FRONTEND_URL") || "http://localhost:3000";
  const apiUrl = Cypress.env("API_URL") || "http://localhost:5011";
  const matricula = "ADM0001";
  const senha = "Admin@123";

  let funcionarioIdCriado: string;
  let matriculaFuncionario: string;

  describe("Cadastrar funcionário", () => {
    beforeEach(() => {
      cy.intercept("GET", `${apiUrl}/usuarios*`).as("getFuncionarios");
      cy.intercept("POST", `${apiUrl}/usuarios`).as("createFuncionario");

      cy.login(matricula, senha);

      cy.visit(`${frontendUrl}/funcionarios`);
      cy.wait("@getFuncionarios");
    });

    it("Deve abrir modal de cadastro ao clicar no botão cadastrar", () => {
      cy.contains("Cadastrar").click();
      cy.getByData("dialog-cadastro-funcionario").should("be.visible");
      cy.contains("Cadastro de funcionário").should("be.visible");
    });

    it("Deve validar campo nome obrigatório", () => {
      cy.contains("Cadastrar").click();
      cy.getByData("dialog-cadastro-funcionario").should("be.visible");

      cy.getByData("input-matricula").type("TEST-001");
      cy.getByData("input-email").type("test@empresa.com");
      cy.getByData("input-telefone").type("(11) 99999-9999");
      cy.getByData("select-perfil").click();
      cy.getByData("select-item-estoquista").click();

      cy.getByData("btn-salvar").click();

      cy.wait(500);
      cy.contains("Nome deve ter no mínimo 3 caracteres").should("be.visible");
      cy.getByData("dialog-cadastro-funcionario").should("be.visible");
    });

    it("Deve validar campo email obrigatório", () => {
      cy.contains("Cadastrar").click();
      cy.getByData("dialog-cadastro-funcionario").should("be.visible");

      cy.getByData("input-nome-funcionario").type("Funcionário Teste");
      cy.getByData("input-matricula").type("TEST-001");
      cy.getByData("input-telefone").type("(11) 99999-9999");
      cy.getByData("select-perfil").click();
      cy.getByData("select-item-estoquista").click();

      cy.getByData("btn-salvar").click();

      cy.wait(500);
      cy.contains("E-mail inválido").should("be.visible");
      cy.getByData("dialog-cadastro-funcionario").should("be.visible");
    });

    it("Deve validar formato de email", () => {
      cy.contains("Cadastrar").click();
      cy.getByData("dialog-cadastro-funcionario").should("be.visible");

      cy.getByData("input-nome-funcionario").type("Funcionário Teste");
      cy.getByData("input-matricula").type("TEST-001");
      cy.getByData("input-email").type("email-invalido");
      cy.getByData("input-telefone").type("(11) 99999-9999");
      cy.getByData("select-perfil").click();
      cy.getByData("select-item-estoquista").click();

      cy.getByData("btn-salvar").click();

      cy.wait(500);
      cy.contains("E-mail inválido").should("be.visible");
      cy.getByData("dialog-cadastro-funcionario").should("be.visible");
    });

    it("Deve validar campo telefone obrigatório", () => {
      cy.contains("Cadastrar").click();
      cy.getByData("dialog-cadastro-funcionario").should("be.visible");

      cy.getByData("input-nome-funcionario").type("Funcionário Teste");
      cy.getByData("input-matricula").type("TEST-001");
      cy.getByData("input-email").type("test@empresa.com");
      cy.getByData("select-perfil").click();
      cy.getByData("select-item-estoquista").click();

      cy.getByData("btn-salvar").click();

      cy.wait(500);
      cy.contains("Telefone inválido").should("be.visible");
      cy.getByData("dialog-cadastro-funcionario").should("be.visible");
    });

    it("Deve validar campo perfil obrigatório", () => {
      cy.contains("Cadastrar").click();
      cy.getByData("dialog-cadastro-funcionario").should("be.visible");

      cy.getByData("input-nome-funcionario").type("Funcionário Teste");
      cy.getByData("input-matricula").type("TEST-001");
      cy.getByData("input-email").type("test@empresa.com");
      cy.getByData("input-telefone").type("(11) 99999-9999");

      cy.getByData("btn-salvar").click();

      cy.wait(500);
      cy.contains("Selecione um perfil").should("be.visible");
      cy.getByData("dialog-cadastro-funcionario").should("be.visible");
    });

    it("Deve validar campo matrícula obrigatório", () => {
      cy.contains("Cadastrar").click();
      cy.getByData("dialog-cadastro-funcionario").should("be.visible");

      cy.getByData("input-nome-funcionario").type("Funcionário Teste");
      cy.getByData("input-email").type("test@empresa.com");
      cy.getByData("input-telefone").type("(11) 99999-9999");
      cy.getByData("select-perfil").click();
      cy.getByData("select-item-estoquista").click();

      cy.getByData("btn-salvar").click();

      cy.wait(500);
      cy.contains("Informe pelo menos 2 caracteres").should("be.visible");
      cy.getByData("dialog-cadastro-funcionario").should("be.visible");
    });

    it("Deve criar funcionário com sucesso com dados válidos", () => {
      const timestamp = Date.now();
      const matricula = `TST-${timestamp.toString().slice(-4)}`;
      matriculaFuncionario = matricula;

      cy.contains("Cadastrar").click();
      cy.getByData("dialog-cadastro-funcionario").should("be.visible");

      cy.getByData("input-nome-funcionario").type("Funcionário Teste Cypress");
      cy.getByData("input-matricula").type(matricula);
      cy.getByData("input-email").type(`test${timestamp}@empresa.com`);
      cy.getByData("input-telefone").type("(11) 98765-4321");
      cy.getByData("select-perfil").click();
      cy.getByData("select-item-estoquista").click();

      cy.getByData("btn-salvar").click();

      cy.wait("@createFuncionario").then((createInterception) => {
        expect(createInterception.response?.statusCode).to.eq(201);
        expect(createInterception.response?.body).to.have.property("data");

        const funcionarioCriado = createInterception.response?.body?.data;
        funcionarioIdCriado = funcionarioCriado?._id;

        expect(funcionarioCriado?.nome_usuario).to.equal(
          "Funcionário Teste Cypress"
        );
        expect(funcionarioCriado?.matricula).to.equal(matricula);
        expect(funcionarioCriado?.perfil).to.equal("estoquista");
      });

      cy.getByData("dialog-cadastro-funcionario").should("not.exist");
      cy.contains("Funcionário preenchido com sucesso!").should("be.visible");
      cy.contains(
        "O email de ativação de conta foi enviado ao email cadastrado!"
      ).should("be.visible");
    });

    it("Deve dar erro ao criar funcionário com matrícula duplicada", () => {
      const timestamp = Date.now();

      cy.contains("Cadastrar").click();
      cy.getByData("dialog-cadastro-funcionario").should("be.visible");

      cy.getByData("input-nome-funcionario").type(
        "Funcionário Duplicado Teste"
      );
      cy.getByData("input-matricula").type(matriculaFuncionario);
      cy.getByData("input-email").type(`duplicado${timestamp}@empresa.com`);
      cy.getByData("input-telefone").type("(11) 91234-5678");
      cy.getByData("select-perfil").click();
      cy.getByData("select-item-gerente").click();

      cy.getByData("btn-salvar").scrollIntoView().click();

      cy.wait("@createFuncionario").then((createInterception) => {
        console.log(createInterception.response);
        expect(createInterception.response?.statusCode).to.eq(409);
        expect(createInterception.response?.body).to.have.property("message");
        expect(createInterception.response?.body?.message).to.contain(
          "Já existe um usuário cadastrado com a matrícula"
        );
      });

      cy.getByData("dialog-cadastro-funcionario").should("be.visible");
      cy.contains("Erro ao cadastrar funcionário").should("exist");
      cy.contains("Já existe um usuário cadastrado com a matrícula").should(
        "exist"
      );
    });
  });

  describe("Editar funcionário", () => {
    beforeEach(() => {
      cy.intercept("GET", `${apiUrl}/usuarios*`).as("getFuncionarios");
      cy.intercept("PATCH", `${apiUrl}/usuarios/*`).as("patchFuncionario");

      cy.login(matricula, senha);

      cy.visit(`${frontendUrl}/funcionarios`);
      cy.wait("@getFuncionarios");
    });

    it("Deve redirecionar para o pop-up de edição ao clicar em editar", () => {
      cy.get("tbody tr").eq(1).click();
      cy.getByData("dialog-listagem-funcionario").should("be.visible");

      cy.getByData("btn-editar-funcionario").click();
      cy.getByData("dialog-edicao-funcionario").should("be.visible");
    });

    it("Deve atualizar funcionário com sucesso", () => {
      cy.get("tbody tr").eq(1).click();
      cy.getByData("dialog-listagem-funcionario").should("be.visible");
      cy.getByData("btn-editar-funcionario").click();

      cy.getByData("dialog-edicao-funcionario").should("be.visible");

      cy.getByData("input-telefone").clear().type("(11) 99999-8888");
      cy.getByData("select-perfil").click();
      cy.getByData("select-item-administrador").click();

      cy.getByData("btn-salvar").click();

      cy.wait("@patchFuncionario").then((patchInterception) => {
        expect(patchInterception.response?.statusCode).to.eq(200);
        expect(patchInterception.response?.body).to.have.property("data");
        expect(patchInterception.response?.body?.data?.telefone).to.equal(
          "(11) 99999-8888"
        );
        expect(patchInterception.response?.body?.data?.perfil).to.equal(
          "administrador"
        );
      });

      cy.getByData("dialog-edicao-funcionario").should("not.exist");
    });

    it("Deve manter mesmas validações do cadastro", () => {
      cy.get("tbody tr").first().click();
      cy.getByData("dialog-listagem-funcionario").should("be.visible");

      cy.getByData("btn-editar-funcionario").click();
      cy.getByData("dialog-edicao-funcionario").should("be.visible");

      cy.getByData("input-telefone").clear();

      cy.getByData("btn-salvar").click();

      cy.wait(500);
      cy.contains("Telefone deve ter no mínimo 10 dígitos").should(
        "be.visible"
      );
      cy.getByData("dialog-edicao-funcionario").should("be.visible");
    });
  });

  describe("Filtrar funcionários", () => {
    beforeEach(() => {
      cy.intercept("GET", `${apiUrl}/usuarios*`).as("getFuncionarios");

      cy.login(matricula, senha);

      cy.visit(`${frontendUrl}/funcionarios`);
      cy.wait("@getFuncionarios");
    });

    it("Deve filtrar funcionários por nome/matrícula/email", () => {
      cy.getByData("input-busca-funcionario").type(
        "Administrador Master{enter}"
      );

      cy.get("tbody tr").first().click();
      cy.getByData("dialog-listagem-funcionario").should("be.visible");
      cy.getByData("dialog-listagem-funcionario").within(() => {
        cy.getByData("input-nome-funcionario").should(
          "have.value",
          "Administrador Master"
        );
      });

      cy.visit(`${frontendUrl}/funcionarios`);
      cy.wait("@getFuncionarios");

      cy.getByData("input-busca-funcionario").type(
        "admin@sistema.com{enter}"
      );

      cy.get("tbody tr").first().click();
      cy.getByData("dialog-listagem-funcionario").should("be.visible");
      cy.getByData("dialog-listagem-funcionario").within(() => {
        cy.getByData("input-email-funcionario").should(
          "have.value",
          "admin@sistema.com"
        );
      });

      cy.visit(`${frontendUrl}/funcionarios`);
      cy.wait("@getFuncionarios");

      cy.getByData("input-busca-funcionario").type(
        "ADM0001{enter}"
      );

      cy.get("tbody tr").first().click();
      cy.getByData("dialog-listagem-funcionario").should("be.visible");
      cy.getByData("dialog-listagem-funcionario").within(() => {
        cy.getByData("input-matricula").should(
          "have.value",
          "ADM0001"
        );
      });
    });

    it("Deve filtrar funcionários por perfil", () => {
      cy.getByData("select-perfil-filtro").click();
      cy.getByData("select-item-administrador").click();

      cy.wait("@getFuncionarios").then((interception) => {
        const url = new URL(interception.request.url);
        expect(url.searchParams.get("perfil")).to.eq("administrador");
      });

      cy.getByData("select-perfil-filtro").click();
      cy.getByData("select-item-gerente").click();

      cy.wait("@getFuncionarios").then((interception) => {
        const url = new URL(interception.request.url);
        expect(url.searchParams.get("perfil")).to.eq("gerente");
      });

      cy.getByData("select-perfil-filtro").click();
      cy.getByData("select-item-estoquista").click();

      cy.wait("@getFuncionarios").then((interception) => {
        const url = new URL(interception.request.url);
        expect(url.searchParams.get("perfil")).to.eq("estoquista");
      });
    });

    it("Deve filtrar funcionários por status", () => {
      cy.getByData("select-status-filtro").click();
      cy.getByData("select-item-status-inativo").click();

      cy.wait("@getFuncionarios").then((interception) => {
        const url = new URL(interception.request.url);
        expect(url.searchParams.get("ativo")).to.eq("false");
      });
    });

    it("Deve limpar filtros de funcionários", () => {
      cy.getByData("input-busca-funcionario").type("Administrador Master");
      cy.getByData("btn-limpar-filtros").click();

      cy.getByData("select-perfil-filtro").click();
      cy.getByData("select-item-gerente").click();
      cy.getByData("btn-limpar-filtros").click();

      cy.getByData("select-status-filtro").click();
      cy.getByData("select-item-status-inativo").click();
      cy.getByData("btn-limpar-filtros").click();

      cy.wait("@getFuncionarios").then((interception) => {
        const url = new URL(interception.request.url);
        expect(url.searchParams.get("usuario")).to.not.be;
        expect(url.searchParams.get("perfil")).to.be.null;
      });
    });
  });

  describe("Paginação de funcionários", () => {
    beforeEach(() => {
      cy.intercept("GET", `${apiUrl}/usuarios*`).as("getFuncionarios");

      cy.login(matricula, senha);

      cy.visit(`${frontendUrl}/funcionarios`);
      cy.wait("@getFuncionarios");
    });

    it("Deve navegar para a próxima página", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-test="btn-proxima-pagina"]').length > 0) {
          cy.getByData("btn-proxima-pagina").should(
            "not.have.class",
            "opacity-50"
          );

          cy.getByData("btn-proxima-pagina").click();

          cy.wait("@getFuncionarios").then((interception) => {
            const url = new URL(interception.request.url);
            expect(url.searchParams.get("page")).to.eq("2");
          });
        } else {
          cy.log("Não há múltiplas páginas para testar navegação");
        }
      });
    });

    it("Deve navegar para a página anterior", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find('[data-test="btn-proxima-pagina"]').length > 0 &&
          !$body.find('[data-test="btn-proxima-pagina"]').hasClass("opacity-50")
        ) {
          cy.getByData("btn-proxima-pagina").click();
          cy.wait("@getFuncionarios");

          cy.getByData("btn-pagina-anterior").should(
            "not.have.class",
            "opacity-50"
          );
          cy.getByData("btn-pagina-anterior").click();

          cy.wait("@getFuncionarios").then((interception) => {
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

      cy.wait("@getFuncionarios").then((interception) => {
        const url = new URL(interception.request.url);
        expect(url.searchParams.get("limite")).to.eq("20");
      });
    });
  });

  describe("Imprimir funcionários", () => {
    beforeEach(() => {
      cy.intercept("GET", `${apiUrl}/usuarios*`).as("getFuncionarios");

      cy.login(matricula, senha);

      cy.visit(`${frontendUrl}/funcionarios`);
      cy.wait("@getFuncionarios");
    });

    it("Deve permitir clicar no botão de impressão sem erros", () => {
      cy.get("tbody tr").first().click();
      cy.getByData("dialog-listagem-funcionario").should("be.visible");

      cy.getByData("btn-imprimir-funcionario").click();

      cy.wait(1000);
      cy.get("body").should("be.visible");
    });
  });

  after(() => {
    if (funcionarioIdCriado && matriculaFuncionario) {
      cy.request({
        method: "PATCH",
        url: `${apiUrl}/usuarios/desativar/${matriculaFuncionario}`,
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
        failOnStatusCode: false,
      }).then(() => {
        cy.log(
          `Funcionário de teste ${matriculaFuncionario} (${funcionarioIdCriado}) desativado`
        );
      });
    }
  });
});
