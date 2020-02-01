const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const LRU = require("lru-cache");

const options = {
  max: 500,
  length(n, key) {
    return n * 2 + key.length;
  },
  maxAge: 1000 * 60 * 60
};
const cache = new LRU(options);

const port = process.env.PORT || 5000;

const getDependenciesAsync = async (packageName, version) => {
  if (version.startsWith("^") || version.startsWith("~")) {
    version = version.substring(1);
  }
  const cachedPackageName = cache.get(packageName);
  if (cachedPackageName) {
    return cachedPackageName;
  }
  try {
    const response = await axios.get(
      `https://registry.npmjs.org/${packageName}/${version}`
    );
    cache.set(packageName, response.data);
    return response.data;
  } catch (e) {
    console.log("cant get dependencies, invalid package name or version", e);
    return {};
  }
};

const buildGraph = async object => {
  const { dependencies } = await getDependenciesAsync(
    object.packageName,
    object.version
  );
  if (!dependencies || Object.keys(dependencies).length === 0) {
    return { name: object.packageName, children: [] };
  }

  const dependencyGraphs = await Promise.all(
    Object.entries(dependencies).map(([packageName, version]) =>
      buildGraph({ packageName, version })
    )
  );

  return { name: object.packageName, children: dependencyGraphs };
};

const app = express();
app.listen(port, () => console.log(`Listening on port ${port}`));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

app.post("/get_dependencies", async (request, response) => {
  const {
    body: { packageName, version }
  } = request;
  const graph = await buildGraph({ packageName, version });

  response.send(graph);
});
cache.reset();
