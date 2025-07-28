// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command for signing in
Cypress.Commands.add('signin', (email, password) => {
  cy.visit('/signin');
  cy.get('input#email').type(email);
  cy.get('input#password').type(password);
  cy.get('button').contains('Submit').click();
});

// Custom command for mocking successful signin
Cypress.Commands.add('mockSigninSuccess', () => {
  cy.intercept('POST', '**/auth/signin', {
    statusCode: 200,
    body: {
      token: 'fake-jwt-token',
      user: {
        _id: '123',
        email: 'test@example.com',
        name: 'Test User'
      }
    }
  }).as('signinSuccess');
});

// Custom command for mocking signin failure
Cypress.Commands.add('mockSigninFailure', (errorMessage = 'Invalid credentials') => {
  cy.intercept('POST', '**/auth/signin', {
    statusCode: 401,
    body: { error: errorMessage }
  }).as('signinFailure');
});

// Custom command to check if user is on signin page
Cypress.Commands.add('shouldBeOnSigninPage', () => {
  cy.url().should('include', '/signin');
  cy.contains('Sign In').should('be.visible');
});

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