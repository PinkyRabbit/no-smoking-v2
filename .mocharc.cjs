'use strict';

module.exports = {
  require: "ts-node/register",
  loader: "ts-node/esm",
  extensions: ["ts"],
  spec: [
    "src/**/*.spec.ts"
  ],
  timeout: '2000',
  ui: 'bdd',
  watch: false,
};