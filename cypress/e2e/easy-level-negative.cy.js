describe("Task - Easy level: Work with form", () => {
  it("Negative scenario: all inputs remain empty", () => {
    cy.visit("https://webdriveruniversity.com/Contact-Us/contactus.html");

    cy.get("#contact_form").submit();
    cy.url().should("include", "/contact_us.php");
    cy.get("body").should("contain", " Error: all fields are required");
  });
  it("Negative scenario: all inputs but email input has been filled correctly", () => {
    cy.visit("https://webdriveruniversity.com/Contact-Us/contactus.html");
    cy.get("#contact_form").find('[name="first_name"]').type(" ");
    cy.get("#contact_form").find('[name="last_name"]').type(" ");
    cy.get("#contact_form").find('[name="email"]').type("INVALID EMAIL");
    cy.get("#contact_form").find('[name="message"]').type(" ");
    cy.get("#contact_form").submit();
    cy.url().should("include", "/contact_us.php");
    cy.get("body").should("contain", " Error: Invalid email address");
  });
});
