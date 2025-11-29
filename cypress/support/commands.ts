/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
  namespace Cypress {
    interface Chainable {
      login(matricula: string, senha: string): Chainable<void>;
      getByData(seletor: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add("login", (matricula: string, senha: string) => {
  cy.clearCookies();
  cy.clearLocalStorage();

  cy.visit("http://localhost:3000/");

  cy.get('input[type="text"]', { timeout: 10000 })
    .should("be.visible")
    .type(matricula);
  cy.get('input[type="password"]').type(senha);
  cy.get('button[type="submit"]').click();
  cy.url().should("include", "/home");
});

Cypress.Commands.add("getByData", (seletor) => {
  return cy.get(`[data-test="${seletor}"]`);
});
export {};