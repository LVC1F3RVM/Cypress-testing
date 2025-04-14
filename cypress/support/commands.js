Cypress.Commands.add("registerUser", (userData) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("apiUrl")}/Account/v1/User`,
    body: {
      userName: userData.username,
      password: userData.password,
    },
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 201) {
      Cypress.env("userId", response.body.userID);
    } else if (response.status === 406) {
      cy.log("User already exists, continuing with test");
    }
  });
});

Cypress.Commands.add("loginUser", (userData) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("apiUrl")}/Account/v1/GenerateToken`,
    body: {
      userName: userData.username,
      password: userData.password,
    },
  }).then((response) => {
    Cypress.env("token", response.body.token);
  });
});

Cypress.Commands.add("addBookToUser", (isbn) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("apiUrl")}/BookStore/v1/Books`,
    headers: {
      Authorization: `Bearer ${Cypress.env("token")}`,
    },
    body: {
      userId: Cypress.env("userId"),
      collectionOfIsbns: [{ isbn }],
    },
  });
});

Cypress.Commands.add("cleanupUser", () => {
  cy.request({
    method: "DELETE",
    url: `${Cypress.env("apiUrl")}/Account/v1/User/${Cypress.env("userId")}`,
    headers: {
      Authorization: `Bearer ${Cypress.env("token")}`,
    },
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("authenticate", () => {
  cy.loginUser(testUser); // Re-generate token if expired
});

Cypress.Commands.add("authenticatedRequest", (options) => {
  cy.request({
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${Cypress.env("token")}`,
    },
  });
});
