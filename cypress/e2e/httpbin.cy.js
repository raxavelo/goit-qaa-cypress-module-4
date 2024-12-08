describe("HttpBin API Tests", () => {
  const baseUrl = "https://httpbin.org";

  // Test 1: Wysłanie żądania GET
  it("should successfully send a GET request", () => {
    const request = {
      method: "GET",
      url: `${baseUrl}/get`,
      failOnStatusCode: false,
    };
    cy.request(request).then((response) =>
      assert.equal(response.status, 200, "Response status should be 200")
    );
  });

  // Test 2: Sprawdzenie czasu trwania zapytania
  it("should verify that the request takes less than 1000ms", () => {
    const request = {
      method: "GET",
      url: `${baseUrl}/get`,
      failOnStatusCode: false,
    };
    cy.request(request).then((response) => {
      assert.isBelow(
        response.duration,
        1000,
        "Response time should be less than 1000ms"
      );
    });
  });

  // Test 3: Wysłanie żądania POST z danymi
  it("should successfully send a POST request", () => {
    const data = { name: "John" };
    const request = {
      method: "POST",
      url: `${baseUrl}/post`,
      body: data,
      failOnStatusCode: false,
    };
    cy.request(request).then((response) => {
      assert.equal(response.status, 200, "Response status should be 200");
      assert.deepEqual(
        response.body.json,
        data,
        "Response body should match request body"
      );
    });
  });

  // Test 4: Wysłanie niestandardowego nagłówka
  it("should send a custom header", () => {
    const request = {
      method: "GET",
      url: `${baseUrl}/headers`,
      headers: {
        "X-Custom-Header": "TestHeaderValue",
      },
      failOnStatusCode: false,
    };
    cy.request(request).then((response) => {
      assert.equal(response.status, 200, "Response status should be 200");
      assert.property(
        response.body.headers,
        "X-Custom-Header",
        "Response should contain 'X-Custom-Header'"
      );
      assert.strictEqual(
        response.body.headers["X-Custom-Header"],
        "TestHeaderValue",
        "X-Custom-Header should have the value 'TestHeaderValue'"
      );
    });
  });

  // Test 5: Wysłanie zapytania z parametrami i sprawdzenie odpowiedzi
  it("should send a GET request with query parameters and verify the response", () => {
    const request = {
      method: "GET",
      url: `${baseUrl}/get`,
      qs: { search: "Cypress", page: 1 },
      failOnStatusCode: false,
    };
    cy.request(request).then((response) => {
      assert.equal(response.status, 200, "Response status should be 200");
      assert.property(
        response.body.args,
        "search",
        'Response should have "search" query parameter'
      );
      assert.strictEqual(
        response.body.args.search,
        "Cypress",
        'Search parameter should be "Cypress"'
      );
      assert.property(
        response.body.args,
        "page",
        'Response should have "page" query parameter'
      );
      assert.strictEqual(
        response.body.args.page,
        "1",
        "Page parameter should be 1"
      );
    });
  });

  // Test 6: Wysłanie zapytania PUT i sprawdzenie, czy dane są poprawnie odbierane
  it("should send a PUT request and verify the response contains the same data", () => {
    const request = {
      method: "PUT",
      url: `${baseUrl}/put`,
      body: { update: "true", id: 123 },
      headers: {
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    };
    cy.request(request).then((response) => {
      assert.equal(response.status, 200, "Response status should be 200");
      assert.deepEqual(
        response.body.json,
        request.body,
        "Response should match the PUT request body"
      );
    });
  });

  // Test 7: Wysłanie zapytania DELETE i sprawdzenie statusu
  it("should send a DELETE request and verify the response status", () => {
    const request = {
      method: "DELETE",
      url: `${baseUrl}/delete`,
      failOnStatusCode: false,
    };
    cy.request(request).then((response) => {
      assert.equal(response.status, 200, "Response status should be 200");
      assert.property(response.body, "url", "Response should contain the URL");
    });
  });

  // Test 8: Wysłanie zapytania PATCH z częściową aktualizacją i sprawdzenie odpowiedzi
  it("should send a PATCH request and verify the response contains the patched data", () => {
    const request = {
      method: "PATCH",
      url: `${baseUrl}/patch`,
      body: { patchField: "newValue" },
      headers: {
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    };
    cy.request(request).then((response) => {
      assert.equal(response.status, 200, "Response status should be 200");
      assert.deepEqual(
        response.body.json,
        request.body,
        "Response should match the PATCH request body"
      );
    });
  });

  // Test 9: Wysłanie zapytania z losowym parametrem i sprawdzenie odpowiedzi
  it("should send a GET request with a random parameter and verify the response contains it", () => {
    const request = {
      method: "GET",
      url: `${baseUrl}/get`,
      qs: { randomParam: Math.random().toString(36).substring(2, 15) },
      failOnStatusCode: false,
    };
    cy.request(request).then((response) => {
      assert.equal(response.status, 200, "Response status should be 200");
      assert.property(
        response.body.args,
        "randomParam",
        "Response should contain the random parameter"
      );
      assert.strictEqual(
        response.body.args.randomParam,
        request.qs.randomParam,
        "Random parameter value should match"
      );
    });
  });

  // Test 10: Wysłanie zapytania z niestandardowym User-Agent
  it("should send a GET request with a custom User-Agent and verify it in the response", () => {
    const request = {
      method: "GET",
      url: `${baseUrl}/user-agent`,
      headers: {
        "User-Agent": "CustomAgent/1.0",
      },
      failOnStatusCode: false,
    };
    cy.request(request).then((response) => {
      assert.equal(response.status, 200, "Response status should be 200");
      assert.strictEqual(
        response.body["user-agent"],
        "CustomAgent/1.0",
        "User-Agent in response should match the one sent in the request"
      );
    });
  });
});
