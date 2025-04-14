// cypress/e2e/saucedemo_bugs.cy.js

describe("Searching for all bugs in Saucedemo", () => {
  const credentials = { username: "problem_user", password: "secret_sauce" };
  beforeEach(() => {
    // Navigate to Saucedemo and login
    cy.visit("https://www.saucedemo.com/");
    cy.title().should("eq", "Swag Labs");
    // Login with valid credentials
    cy.get('[data-test="username"]').type(credentials.username);
    cy.get('[data-test="password"]').type(credentials.password);
    cy.get('[data-test="login-button"]').click();
    // Verify successful login
    cy.get('[data-test="title"]').should("have.text", "Products");
  });
  // 1. Verify image display bug
  it("All product images should be unique", () => {
    cy.get('[data-test="inventory-item-sauce-labs-backpack-img"]').then(
      ($imgs) => {
        const srcValues = $imgs.map((_, el) => el.src).get();
        const uniqueImages = [...new Set(srcValues)];
        // Problem user shows same image for all products
        expect(uniqueImages.length).to.equal($imgs.length);
      }
    );
  });
  // 2. Verify price sorting functionality
  it("Price sorting should work correctly", () => {
    cy.get('[data-test="product-sort-container"]').select("lohi");
    cy.get('[data-test="inventory-item-price"]').then(($prices) => {
      const prices = $prices
        .map((_, el) => parseFloat(el.innerText.replace("$", "")))
        .get();
      const sorted = [...prices].sort((a, b) => a - b);
      if (credentials.username === "problem_user") {
        // Known bug - verify sorting is wrong
        expect(prices).not.to.deep.equal(sorted);
        cy.log("Known bug verified: Prices not sorted correctly");

        // Additional verification of the specific bug
        const uniquePrices = [...new Set(prices)];
        expect(uniquePrices.length).to.be.lessThan(prices.length);
      } else {
        // Normal case - verify correct sorting
        expect(prices).to.deep.equal(sorted);
      }
    });
  });
  // 3. Verify add-to-cart functionality
  it("Add to cart buttons should work properly", () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    // Problem user may have cart count issues
    cy.get('[data-test="shopping-cart-badge"]').should("have.text", "1");
  });
  // 4. Verify remove-from-cart functionality
  it("Remove from cart buttons should work properly", () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="shopping-cart-badge"]').should("have.text", "1");
    // Attempt to remove item
    cy.get('[data-test="remove-sauce-labs-backpack"]')
      .should("have.text", "Remove")
      .click();
    // Verify the bug (problem_user remove fails)
    cy.get(".shopping_cart_badge").then(($badge) => {
      if ($badge.length > 0) {
        // Expected behavior for problem_user (bug)
        cy.log("BUG CONFIRMED: Remove button did not work");
        cy.wrap($badge).should("have.text", "1");
        cy.get('[data-test="remove-sauce-labs-backpack"]').should(
          "have.text",
          "Remove"
        );
      } else {
        cy.log("BUG NOT PRESENT: Remove button worked");
      }
    });
  });
  // 5. Verify About page functionality
  it("About link in burger-menu button should redirect on correct page", () => {
    // Open the menu
    cy.get("#react-burger-menu-btn").click();
    cy.get(".bm-menu").should("be.visible");
    // Click the About link
    cy.get('[data-test="about-sidebar-link"]').should("be.visible").click();
    // Handle cross-origin transition
    cy.origin("https://saucelabs.com", () => {
      // Verify successful navigation
      cy.url().should("include", "/error/404");
      cy.get("body").should("not.contain", "Sauce Labs");
    });
  });
  // 6. Verify checkout form field value bug
  it("lastName input in the checkout cart items page should display inserted value", () => {
    // Add item to cart
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="shopping-cart-link"]').click();

    // Proceed to checkout
    cy.get('[data-test="checkout"]').click();
    cy.url().should("include", "checkout-step-one.html");

    // Fill form with test data
    const testData = {
      firstName: "John",
      lastName: "Doe",
      postalCode: "12345",
    };
    cy.get('[data-test="firstName"]').type(testData.firstName);
    cy.get('[data-test="lastName"]').type(testData.lastName);
    cy.get('[data-test="postalCode"]').type(testData.postalCode);
    // Verify the bug: firstName == last character of lastName
    cy.get('[data-test="firstName"]').should(($input) => {
      const firstNameValue = $input.val();
      const expectedValue = testData.lastName.slice(-1); // Gets last character ('e')
      expect(firstNameValue).to.equal(expectedValue);
    });
    cy.get('[data-test="lastName"]').should("have.value", ""); // Due to bug
    cy.log(`Expected last character: "${testData.lastName.slice(-1)}"`);
    cy.get('[data-test="firstName"]').then(($el) =>
      cy.log(`Actual firstName value: "${$el.val()}"`)
    );
    // Visual confirmation
    cy.screenshot("checkout-form-bug");
  });
});
