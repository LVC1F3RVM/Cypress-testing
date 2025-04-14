// cypress/e2e/api-tests.cy.js
import apiClient from "../support/api-client";

describe("Book Store API Tests", () => {
  const testUser = {
    username: `testuser_${Math.floor(Math.random() * 100000)}`,
    password: "ValidPass123!",
  };

  const testBook = {
    isbn: "9781449325862",
    title: "Git Pocket Guide",
  };

  before(() => {
    apiClient.registerUser(testUser).then(() => apiClient.login(testUser));
  });

  // after(() => {
  //   apiClient.deleteUser();
  // });

  it("should reliably verify book addition", () => {
    // 1. Add book with debug
    apiClient.addBookToUser(testBook).then((response) => {
      cy.log("Add Book Response:", response.body);
      expect(response.status).to.eq(201);
    });
    // 2. Verification with retry
    const checkBookExists = () => {
      return cy
        .request({
          method: "GET",
          url: `${Cypress.env("apiUrl")}/Account/v1/User/${Cypress.env(
            "userId"
          )}`,
          headers: { Authorization: `Bearer ${Cypress.env("apiToken")}` },
        })
        .then((response) => {
          const foundBook = response.body.books?.find(
            (b) =>
              b.isbn === testBook.isbn ||
              b?.collectionOfIsbns?.some((i) => i.isbn === testBook.isbn)
          );
          if (!foundBook) {
            throw new Error(`Book not found yet`); // Triggers retry
          }
          return foundBook; // Return for further assertions
        });
    };
    // Retry mechanism
    Cypress._.times(5, (attempt) => {
      cy.log(`Verification attempt ${attempt + 1}`);
      checkBookExists();
      if (attempt < 4) cy.wait(2000); // Only wait between attempts
    });
    // Final assertion
    checkBookExists().should("have.property", "isbn", testBook.isbn);
    // 3. Cleanup
    apiClient.removeBookFromUser(testBook).its("status").should("eq", 204);
  });
});
