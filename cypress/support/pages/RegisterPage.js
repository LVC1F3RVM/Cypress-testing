class RegisterPage {
  elements = {
    firstName: () => cy.get("#firstname"),
    lastName: () => cy.get("#lastname"),
    userName: () => cy.get("#userName"),
    password: () => cy.get("#password"),
    registerBtn: () => cy.get("#register"),
  };

  visit() {
    cy.visit("/register");
  }
}

export default new RegisterPage();
