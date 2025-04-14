class BookStorePage {
  elements = {
    usernameField: () => cy.get("#userName"),
    passwordField: () => cy.get("#password"),
    loginBtn: () => cy.get("#login"),
    bookTitle: (title) => cy.contains(".rt-tbody a", title),
  };

  visit() {
    cy.visit("/books");
  }

  verifyBookInCollection(title) {
    this.elements.bookTitle(title).should("be.visible");
  }
}

export default new BookStorePage();
