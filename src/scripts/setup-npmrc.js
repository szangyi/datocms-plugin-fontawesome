const fs = require("fs");
require("dotenv").config();

const token = process.env.FONT_AWESOME_TOKEN;

if (!token) {
  console.error("FONT_AWESOME_TOKEN is not defined");
  process.exit(1);
}

const npmrcContent = `@fortawesome:registry=https://npm.fontawesome.com/
//npm.fontawesome.com/:_authToken=${token}
registry=https://registry.npmjs.org/
`;

fs.writeFileSync(".npmrc", npmrcContent);
console.log(".npmrc written with Font Awesome token");
