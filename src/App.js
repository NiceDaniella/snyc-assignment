import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import Tree from "react-d3-tree";

function App() {
  const [data, setData] = useState();
  const [packageName, setPackageName] = useState("");
  const [version, setVersion] = useState("");

  function handleInputName(e) {
    setPackageName(e.target.value);
  }

  function handleInputVersion(e) {
    setVersion(e.target.value);
  }
  async function getDependenciesApiCall() {
    const response = await axios.post("/get_dependencies", {
      packageName,
      version
    });
    if (response.status !== 200) {
      throw Error("Client was unable to fetch data" + response.statusText);
    }
    return response.data;
  }
  function handleSubmit(e) {
    e.preventDefault();
    getDependenciesApiCall(packageName, version)
      .then(res => {
        setData(res);
        setPackageName("");
        setVersion("");
      })
      .catch(err => console.log("API call to fetch data failed", err));
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit} method="post">
        <div>
          <label data-testid="package-name-label">Enter package name: </label>
          <input
            data-testid="package-name-input"
            type="text"
            name="packageName"
            id="packageName"
            value={packageName}
            onChange={e => handleInputName(e)}
            required
          />
          <label data-testid="version-label">Enter version: </label>
          <input
            data-testid="version-input"
            type="text"
            name="version"
            id="version"
            value={version}
            onChange={e => handleInputVersion(e)}
            required
          />
        </div>
        <button data-testid="submit-button" type="submit">
          Get dependencies
        </button>
      </form>
      <p data-testid="display-graph">Dependencies graph:</p>
      {data && (
        <div id="treeWrapper" style={{ width: "100%", height: "600px" }}>
          <Tree data={data} />
        </div>
      )}
    </div>
  );
}

export default App;
