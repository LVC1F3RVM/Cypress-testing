import BookStorePage from "../support/pages/BookStorePage";
// import RegisterPage from "../support/pages/RegisterPage";

describe("Book Store API & UI Flow", () => {
  const testUser = {
    username: Cypress.env("userName"),
    password: Cypress.env("password"),
  };

  const testBook = {
    isbn: "9781449325862",
    title: "Git Pocket Guide",
  };

  before(() => {
    // Register user via API
    cy.registerUser(testUser);
    // Login via API
    cy.loginUser(testUser);
  });

  after(() => {
    // Cleanup after test
    cy.cleanupUser();
  });

  it("should reliably verify book addition", () => {
    // 1. API Action - Add book
    cy.addBookToUser(testBook.isbn);

    // 2. API Verification - Check user's books with auth
    cy.request({
      method: "GET",
      url: `${Cypress.env("apiUrl")}/Account/v1/User/${Cypress.env("userId")}`,
      headers: {
        Authorization: `Bearer ${Cypress.env("token")}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.books).to.deep.include({ isbn: testBook.isbn });
    });

    // 3. UI Verification
    cy.visit("/profile", {
      timeout: 90000,
      onBeforeLoad(win) {
        win.localStorage.setItem("token", Cypress.env("token"));
        win.localStorage.setItem("userId", Cypress.env("userId"));
      },
    });

    // 4. Progressive assertions
    cy.get("#userName-value", { timeout: 15000 }).should(
      "contain",
      testUser.username
    );
    BookStorePage.verifyBookInCollection(testBook.title);
  });
});
