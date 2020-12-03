const {parse} = require("@babel/parser")
const t = require("@babel/types")
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const loaderUtils = require("loader-utils");

const defaultOpt = {
  catchCode: identifier => `console.error('😭 我大意了啊没有闪',${identifier})`,
  identifier: "e",
  finallyCode: null
};

function index(source) {
  const ast = parse(source, {
    sourceType: "module", // 支持 es6 module
    plugins: ["dynamicImport"] // 支持动态 import
  });

  let options = loaderUtils.getOptions(this);
  options = {
    ...defaultOpt,
    ...options
  };

  if (typeof options.catchCode === "function") {
    options.catchCode = options.catchCode(options.identifier);
  }
  let finallyNode = options.finallyCode && parse(options.finallyCode).program.body;

  const catchClause = t.catchClause(
    t.identifier(options.identifier),
    t.blockStatement(parse(options.catchCode).program.body)
  )
  const visitor = {
    AwaitExpression(path) {
      if (path.findParent((path) => t.isTryStatement(path.node))) return;
      if (t.isMemberExpression(path.node.argument.callee) && path.node.argument.callee.object.name === "Promise") return;
      if (t.isNewExpression(path.node.argument.callee.object)) return;

      if (t.isVariableDeclaration(path.parentPath.parent) || t.isAssignmentExpression(path.parentPath)) {
        let tryCatchAst = t.tryStatement(
          t.blockStatement(path.parentPath.parentPath.parentPath.node.body),
          catchClause,
          finallyNode && t.blockStatement(finallyNode)
        );
        path.parentPath.parentPath.parentPath.replaceWithMultiple([tryCatchAst])
        return
      }
      if (t.isReturnStatement(path.parent)) {
        let tryCatchAst = t.tryStatement(
          t.blockStatement([
            t.returnStatement(path.node)
          ]),
          catchClause,
          finallyNode && t.blockStatement(finallyNode)
        );
        path.parentPath.replaceWithMultiple([tryCatchAst]);
        return

      }
      if (t.isArrowFunctionExpression(path.parentPath.node)) {
        let tryCatchAst =
          t.blockStatement([
            t.tryStatement(
              t.blockStatement([
                t.returnStatement(path.node)
              ]),
              catchClause,
              finallyNode && t.blockStatement(finallyNode)
            )
          ]);
        path.replaceWith(tryCatchAst)
        return false;
      }
      let tryCatchAst = t.tryStatement(
        t.blockStatement([
          t.expressionStatement(path.node)
        ]),
        catchClause,
        finallyNode && t.blockStatement(finallyNode)
      );
      path.replaceWithMultiple([tryCatchAst]);
      return false;
    }
  }
  traverse(ast, visitor);
  console.log('\x1B[33m%s\x1B[0m', '✔ over')
  return generator(ast).code;
}

module.exports = index
