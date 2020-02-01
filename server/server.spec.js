jest.mock("./server.js");
const server = require("./server.js");

it("works with promises", async () => {
  const expectedData = {
    dependencies: ["test1", "test2"]
  };

  const data = await server.getDepAsync("test", "latest");
  expect(data.data).not.toBeNull();
  expect(data.data).toEqual(expectedData);
});
