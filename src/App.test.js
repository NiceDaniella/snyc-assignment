import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axiosMock from "axios";
import App from "./App.js";

jest.mock("axios");

afterEach(cleanup);

it("fetches and displays data", async () => {
  const { getByText } = render(<App />);

  axiosMock.post.mockResolvedValueOnce({
    data: {
      name: "react",
      children: []
    }
  });

  fireEvent.click(getByText("Get dependencies"));

  expect(axiosMock.post).toHaveBeenCalledTimes(1);
  expect(axiosMock.post).toHaveBeenCalledWith("/get_dependencies", {
    packageName: "",
    version: ""
  });
});

it("Input values updates on change", () => {
  const { getByTestId } = render(<App />);
  const packageNameInput = getByTestId("package-name-input");
  const versionInput = getByTestId("version-input");

  fireEvent.change(packageNameInput, { target: { value: "test" } });
  fireEvent.change(versionInput, { target: { value: "version" } });

  expect(packageNameInput.value).toBe("test");
  expect(versionInput.value).toBe("version");
});

it("renders form elements", () => {
  const { queryByTestId } = render(<App />);

  expect(queryByTestId("package-name-label")).toBeTruthy();
  expect(queryByTestId("package-name-input")).toBeTruthy();
  expect(queryByTestId("version-label")).toBeTruthy();
  expect(queryByTestId("version-input")).toBeTruthy();
  expect(queryByTestId("submit-button")).toBeTruthy();
  expect(queryByTestId("display-graph")).toBeTruthy();
});

it("App component snapshot", () => {
  const container = render(<App />);
  expect(container).toMatchSnapshot();
});
