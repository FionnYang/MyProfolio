describe('Sign In Page E2E Tests', () => {
  beforeEach(() => {
    // Directly visit signin page with error handling
    cy.visit('/signin', { failOnStatusCode: false });
  });

  it('should display the signin form correctly', () => {
    // Check if we're on the signin page
    cy.contains('Sign In').should('be.visible');
    
    // Check form elements
    cy.get('input#email').should('be.visible').and('have.attr', 'type', 'email');
    cy.get('input#password').should('be.visible').and('have.attr', 'type', 'password');
    cy.get('button').contains('Submit').should('be.visible');
  });

  it('should allow user to type in form fields', () => {
    const testEmail = 'test@example.com';
    const testPassword = 'password123';

    // Type in email field
    cy.get('input#email')
      .type(testEmail)
      .should('have.value', testEmail);

    // Type in password field
    cy.get('input#password')
      .type(testPassword)
      .should('have.value', testPassword);
  });

  it('should show error for invalid credentials', () => {
    // Mock signin failure
    cy.intercept('POST', '**/auth/signin', {
      statusCode: 401,
      body: { error: 'Email or password is incorrect' }
    }).as('signinFailure');
    
    // Fill and submit form
    cy.get('input#email').type('invalid@email.com');
    cy.get('input#password').type('wrongpassword');
    cy.get('button').contains('Submit').click();

    // Wait for API call
    cy.wait('@signinFailure');

    // Check for error message
    cy.get('p').contains('Email or password is incorrect').should('be.visible');
  });

  it('should successfully sign in with valid credentials', () => {
    // Mock successful signin
    cy.intercept('POST', '**/auth/signin', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        user: {
          _id: '123',
          email: 'admin@test.com',
          name: 'Admin User'
        }
      }
    }).as('signinSuccess');
    
    // Fill and submit form
    cy.get('input#email').type('admin@test.com');
    cy.get('input#password').type('adminpassword');
    cy.get('button').contains('Submit').click();

    // Wait for API call
    cy.wait('@signinSuccess');

    // Should redirect away from signin page
    cy.url().should('not.include', '/signin');
  });

  it('should clear form fields after page refresh', () => {
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    
    // Fill form fields
    cy.get('input#email').type(testEmail);
    cy.get('input#password').type(testPassword);
    
    // Verify fields are filled
    cy.get('input#email').should('have.value', testEmail);
    cy.get('input#password').should('have.value', testPassword);
    
    // Refresh page
    cy.reload();
    
    // Form should be reset
    cy.get('input#email').should('have.value', '');
    cy.get('input#password').should('have.value', '');
  });
});