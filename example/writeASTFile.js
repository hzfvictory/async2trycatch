const recast = require("recast");
const fs = require('fs')
const path = require('path')

const writeASTFile = function (ast, filename) {
  if (!ast) return;
  let curPathName = process.argv[1].split("/");
  filename = curPathName[curPathName.length - 1]
  const newCode = recast.prettyPrint(ast, {tabWidth: 2}).code
  filename = filename.split('.')[0] + '.export.js'
  fs.writeFileSync(path.join(process.cwd(), filename), newCode)
}

module.exports = writeASTFile;