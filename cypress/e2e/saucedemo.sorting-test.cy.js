describe("Task - Intermediate level: Testing of Sorting at Saucedemo", () => {
  const credentials = { username: "standard_user", password: "secret_sauce" };
  it("Select sort by price (High to low) and make sure products are displayed correctly", () => {
    // 1. Navigate to Saucedemo
    cy.visit("https://www.saucedemo.com");
    // 2. Login with valid credentials
    cy.get('[data-test="username"]').type(credentials.username);
    cy.get('[data-test="password"]').type(credentials.password);
    cy.get('[data-test="login-button"]').click();
    // 3. Verify successful login
    cy.url().should("include", "/inventory.html");
    cy.get('[data-test="title"]').should("contain", "Products");
    // 4. Sort products by price (High to Low)
    cy.get('[data-test="product-sort-container"]').select("hilo");
    cy.get('[data-test="product-sort-container"]').should("have.value", "hilo");
    // 5. Verify products are sorted correctly
    cy.get(
      '[data-test="inventory-item-description"] > .pricebar > [data-test="inventory-item-price"]'
    ).then(($prices) => {
      const prices = $prices
        .toArray()
        .map((el) => parseFloat(el.innerText.replace("$", "")));
      expect(prices).to.have.length.gt(1, "Should have multiple products");
      // Check descending order
      const sorted = [...prices].sort((a, b) => b - a);
      expect(prices).to.deep.equal(
        sorted,
        "Prices should be sorted high to low"
      );
      // Visual confirmation
      cy.screenshot("sorted-products", {
        capture: "viewport",
        overwrite: true,
      });
    });
  });
});
