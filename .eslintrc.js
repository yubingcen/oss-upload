module.exports = {
  root: true,
  env: {
    node: true,
    es2020: true,
  },
  extends: ["plugin:prettier/recommended"],
  parserOptions: {
    sourceType: "module",
    requireConfigFile: false,
  },
};
