class BookStoreApiClient {
  constructor() {
    this.baseUrl = "https://demoqa.com";
    Cypress.env("apiCredentials", null);
    Cypress.env("apiToken", null);
    Cypress.env("userId", null);
  }

  _refreshToken() {
    if (!Cypress.env("apiCredentials")) {
      throw new Error("No credentials available for token refresh");
    }
    return cy
      .request({
        method: "POST",
        url: `${this.baseUrl}/Account/v1/GenerateToken`,
        body: Cypress.env("apiCredentials"),
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.status === 200 && response.body.token) {
          Cypress.env("apiToken", response.body.token);
          return response.body.token;
        }
        throw new Error("Token refresh failed");
      });
  }

  registerUser(user) {
    return cy
      .request({
        method: "POST",
        url: `${this.baseUrl}/Account/v1/User`,
        body: {
          userName: user.username,
          password: user.password,
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        failOnStatusCode: false,
      })
      .then((response) => {
        if (response.status === 201) {
          Cypress.env("userId", response.body.userID);
          return response;
        }
        throw new Error(
          `Registration failed (${response.status}): ${JSON.stringify(
            response.body
          )}`
        );
      });
  }

  login(user) {
    Cypress.env("apiCredentials", {
      userName: user.username,
      password: user.password,
    });

    return cy
      .request({
        method: "POST",
        url: `${this.baseUrl}/Account/v1/GenerateToken`,
        body: Cypress.env("apiCredentials"),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        failOnStatusCode: false,
      })
      .then((response) => {
        if (response.status === 200 && response.body.token) {
          Cypress.env("apiToken", response.body.token);
          return response;
        }
        cy.log("Login Error Details:", {
          status: response.status,
          body: response.body,
        });
        throw new Error(`Login failed with status ${response.status}`);
      });
  }

  addBookToUser(book) {
    if (!Cypress.env("apiToken") || !Cypress.env("userId")) {
      throw new Error("Authentication required - missing token or userId");
    }

    return cy
      .request({
        method: "POST",
        url: `${this.baseUrl}/BookStore/v1/Books`,
        headers: {
          Authorization: `Bearer ${Cypress.env("apiToken")}`,
          "Content-Type": "application/json",
        },
        body: {
          userId: Cypress.env("userId"),
          collectionOfIsbns: [{ isbn: book.isbn }],
        },
        failOnStatusCode: false,
      })
      .then((response) => {
        if (response.status !== 201) {
          cy.log("Add Book Error:", {
            status: response.status,
            body: response.body,
          });
          throw new Error(`Failed to add book (status ${response.status})`);
        }
        return response;
      });
  }

  removeBookFromUser(book) {
    if (!Cypress.env("apiToken") || !Cypress.env("userId")) {
      throw new Error("Authentication required - missing token or userId");
    }

    return cy
      .request({
        method: "DELETE",
        url: `${this.baseUrl}/BookStore/v1/Book`,
        headers: {
          Authorization: `Bearer ${Cypress.env("apiToken")}`,
          "Content-Type": "application/json",
        },
        body: {
          isbn: book.isbn,
          userId: Cypress.env("userId"),
        },
        failOnStatusCode: false,
      })
      .then((response) => {
        if (response.status !== 204) {
          cy.log("Remove Book Error:", {
            status: response.status,
            body: response.body,
          });
          throw new Error(`Failed to remove book (status ${response.status})`);
        }
        return response;
      });
  }

  deleteUser() {
    return cy
      .request({
        method: "DELETE",
        url: `${this.baseUrl}/Account/v1/User/${Cypress.env("userId")}`,
        headers: {
          Authorization: `Bearer ${Cypress.env("apiToken")}`,
          "Content-Type": "application/json",
        },
        failOnStatusCode: false,
      })
      .then((response) => {
        if (response.status === 401) {
          cy.log("Token expired - automatically refreshing...");
          return this._refreshToken().then(() => {
            return cy.request({
              method: "DELETE",
              url: `${this.baseUrl}/Account/v1/User/${Cypress.env("userId")}`,
              headers: {
                Authorization: `Bearer ${Cypress.env("apiToken")}`,
                "Content-Type": "application/json",
              },
            });
          });
        }
        if (response.status !== 204) {
          cy.log("Delete User Failed:", {
            userId: Cypress.env("userId"),
            tokenExists: !!Cypress.env("apiToken"),
            response: response.body,
          });
          throw new Error(`Deletion failed with status ${response.status}`);
        }
        return response;
      });
  }
}

// Export singleton instance
export default new BookStoreApiClient();
