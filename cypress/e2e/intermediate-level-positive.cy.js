describe("Task - Intermediate level: Sending form", () => {
  it("Positive scenario: all inputs has been filled in correctly", () => {
    cy.visit("https://demoqa.com/automation-practice-form");
    // ===== TEXT INPUTS =====
    cy.get("#userForm")
      .find("#firstName")
      .type("Homer")
      .should("have.value", "Homer");
    cy.get("#userForm")
      .find("#lastName")
      .type("Simpson")
      .should("have.value", "Simpson");
    cy.get("#userForm")
      .find("#userEmail")
      .type("homer.simpson@dohmail.com")
      .should("have.value", "homer.simpson@dohmail.com");
    cy.get("#userNumber").type("1234567890").should("have.value", "1234567890");
    // ===== RADIO BUTTONS (Gender) =====
    // Better than using IDs since they change based on position
    cy.contains(".custom-control-label", "Male").click();
    cy.get("#gender-radio-1").should("be.checked");
    // ===== DATE PICKER =====
    cy.get("#dateOfBirthInput").click();
    cy.get(".react-datepicker__month-select").select("January");
    cy.get(".react-datepicker__year-select").select("1990");
    cy.get(".react-datepicker__day--015").click();
    cy.get("#dateOfBirthInput").should("have.value", "15 Jan 1990");
    // ===== SUBJECTS =====
    cy.get("#subjectsInput").type("Maths{enter}");
    cy.get("#subjectsInput").type("Physics{enter}");
    cy.get(".subjects-auto-complete__multi-value").should("have.length", 2);
    // ===== CHECKBOXES (Hobbies) =====
    cy.contains(".custom-control-label", "Sports").click();
    cy.contains(".custom-control-label", "Reading").click();
    cy.get("#hobbies-checkbox-1").should("be.checked");
    cy.get("#hobbies-checkbox-2").should("be.checked");
    // ===== FILE UPLOAD =====
    cy.get("#uploadPicture").selectFile("cypress/fixtures/sample.png", {
      force: true,
    });
    cy.get("#uploadPicture").should(($input) => {
      const fileName = $input[0].files[0].name;
      expect(fileName).to.eq("sample.png");
    });
    // ===== ADDRESS =====
    cy.get("#currentAddress").type(
      "742 Evergreen Terrace, Springfield\nIL 62704, USA",
      { delay: 0 }
    );
    // ===== STATE AND CITY DROPDOWNS =====
    cy.get("#state").click();
    cy.contains("#react-select-3-option-0", "NCR").click();
    cy.get("#city").click();
    cy.contains("#react-select-4-option-0", "Delhi").click();
    // ===== SUBMIT =====
    cy.get("#submit").click();
    // ===== VALIDATION =====
    cy.get("#example-modal-sizes-title-lg").should(
      "contain",
      "Thanks for submitting the form"
    );
    cy.contains(".table-responsive td", "Homer Simpson").should("exist");
    cy.contains(".table-responsive td", "homer.simpson@dohmail.com").should(
      "exist"
    );
    cy.contains(".table-responsive td", "Male").should("exist");
    cy.contains(".table-responsive td", "1234567890").should("exist");
    cy.contains(".table-responsive td", "15 January,1990").should("exist");
    cy.contains(".table-responsive td", "Maths, Physics").should("exist");
    cy.contains(".table-responsive td", "sample.png").should("exist");
    cy.contains(
      ".table-responsive td",
      "742 Evergreen Terrace, Springfield IL 62704, USA"
    ).should("exist");
    cy.contains(".table-responsive td", "NCR Delhi").should("exist");
  });
});
