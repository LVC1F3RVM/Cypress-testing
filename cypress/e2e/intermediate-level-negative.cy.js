describe("Task - Intermediate level: Sending form", () => {
  it("Negative scenario #1: submitting with empty required fields", () => {
    cy.visit("https://demoqa.com/automation-practice-form");
    // Attempt submission without filling any required fields
    cy.get("#submit").click();
    // List of required fields to validate
    const requiredFields = ["#firstName", "#lastName", "#userNumber"];
    requiredFields.forEach((selector) => {
      // Check border color (Bootstrap 'danger' red)
      cy.get(selector).should("have.css", "border-color", "rgb(220, 53, 69)");
    });
    cy.get("#example-modal-sizes-title-lg").should("not.exist");
  });
  it("Negative scenario #2: invalid email format", () => {
    cy.visit("https://demoqa.com/automation-practice-form");
    // Fill form with invalid email
    cy.get("#firstName").type("Homer");
    cy.get("#lastName").type("Simpson");
    cy.get("#userEmail").type("not-an-email");
    // Submit and verify email validation
    cy.get("#submit").click();
    cy.get("#userEmail").should("have.css", "border-color", "rgb(220, 53, 69)");
    cy.get("#example-modal-sizes-title-lg").should("not.exist");
  });
  it("Negative scenario #3: too short phone number ", () => {
    cy.visit("https://demoqa.com/automation-practice-form");
    // Fill form with invalid phone number
    cy.get("#firstName").type("Homer");
    cy.get("#lastName").type("Simpson");
    cy.get("#userEmail").type("homer@example.com");
    cy.get("#userNumber").type(" "); // Too short
    // Submit and verify phone validation
    cy.get("#submit").click();
    cy.get("#userNumber").should(
      "have.css",
      "border-color",
      "rgb(220, 53, 69)"
    );
    cy.get("#example-modal-sizes-title-lg").should("not.exist");
  });
  it("Negative scenario: no gender selected", () => {
    cy.visit("https://demoqa.com/automation-practice-form");
    // Fill all fields except gender
    cy.get("#firstName").type("Homer");
    cy.get("#lastName").type("Simpson");
    cy.get("#userEmail").type("homer@example.com");
    cy.get("#userNumber").type("1234567890");
    // Submit without selecting gender
    cy.get("#submit").click();
    // Verify gender validation (custom check since DemoQA doesn't highlight this)
    cy.get("#example-modal-sizes-title-lg").should("not.exist");
    cy.get("#genterWrapper").should(($el) => {
      expect($el.find("input:checked").length).to.equal(0);
    });
  });
});
