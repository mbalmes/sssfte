const mkdirp = require("mkdirp");
const fs = require("fs");
const _ = require("lodash");

const buildFolder = process.argv[process.argv.length - 1];

const buildLinkList = function() {
  return `<ul>${fs
    .readdirSync(`${buildFolder}/content`)
    .filter(x => _.endsWith(x, ".md"))
    .map(md=>md.replace('.md',''))
    .map(md => `<li><a href="${md}.html">${md}</a></li>`)
    .join("")}
    </ul>`;
};

mkdirp(`${buildFolder}/_build`, function(err) {
  const templateFileContents = fs.readFileSync(
    `${buildFolder}/index.html`,
    "utf-8"
  );
  fs.writeFileSync(
    `${buildFolder}/_build/index.html`,
    templateFileContents.replace(/{ links }/i, buildLinkList())
  );
});
