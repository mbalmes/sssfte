const mkdirp = require("mkdirp");
const fs = require("fs");
const _ = require("lodash");

const showdown = require("showdown");
const converter = new showdown.Converter();
const buildFolder = process.argv[process.argv.length - 1];

const getMarkdownFiles = function() {
  return fs
    .readdirSync(`${buildFolder}/content`)
    .filter(x => _.endsWith(x, ".md"));
};

const buildLinkList = function() {
  const markdownFiles = getMarkdownFiles();
  const markdownFilesWithTitles = _.zip(
    markdownFiles,
    markdownFiles.map(f =>
        getTitleFromMarkdown(fs.readFileSync(`${buildFolder}/content/${f}`,'utf-8'))
    )
  );
  return `<ul>${markdownFilesWithTitles
    .map(x => `<li><a href="${x[0]}.html">${x[1]}</a></li>`)
    .join("")}
    </ul>`;
};

const buildDefaultContent = function() {
  return converter.makeHtml(
    fs.readFileSync(`${buildFolder}/content/index.md`, "utf-8")
  );
};

const getTitleFromMarkdown = function(markdown) {
    const match = markdown.match(/#\s.*/);
    return match === null ? "" : match[0].replace(/#\s/,'');
};

mkdirp(`${buildFolder}/_build`, function(err) {
  let templateFileContents = fs.readFileSync(
    `${buildFolder}/index.html`,
    "utf-8"
  );
  templateFileContents = templateFileContents.replace(
    /{ links }/i,
    buildLinkList()
  );
  templateFileContents = templateFileContents.replace(
    /{ content }/i,
    buildDefaultContent()
  );

  fs.writeFileSync(`${buildFolder}/_build/index.html`, templateFileContents);
});
