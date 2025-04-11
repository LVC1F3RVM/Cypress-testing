describe("Task - Easy level: Work with form", () => {
  it("Positive scenario: all inputs has been filled in correctly", () => {
    cy.visit("https://webdriveruniversity.com/Contact-Us/contactus.html");

    cy.get("#contact_form").find('[name="first_name"]').type("Homer");
    cy.get("#contact_form").find('[name="last_name"]').type("Simpson");
    cy.get("#contact_form").find('[name="email"]').type("example@test.com");
    cy.get("#contact_form")
      .find('[name="message"]')
      .type("Your example message");
    cy.get("#contact_form").submit();
    cy.url().should("include", "/contact-form-thank-you.html");
    cy.get("#contact_reply").should("contain", "Thank You for your Message!");
  });
});
