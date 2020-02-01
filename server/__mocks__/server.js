const data = {
  testlatest: {
    dependencies: ["test1", "test2"]
  }
};
const getDepAsync = (packageName, version) => {
  return new Promise((resolve, reject) => {
    const response = data[packageName + version];
    if (response) {
      resolve({ data: response });
    } else {
      reject({
        error: "cant get dependencies, invalid package name or version"
      });
    }
  });
};
module.exports = { getDepAsync };
