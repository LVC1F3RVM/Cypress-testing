const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://demoqa.com",
    env: {
      apiUrl: "https://demoqa.com",
      userName: `testuser_${Math.floor(Math.random() * 100000)}`,
      password: "ValidPass123!",
      userId: "",
      token: "",
    },
  },
});
