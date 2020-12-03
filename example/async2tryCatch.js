const {parse} = require("@babel/parser")
const t = require("@babel/types")
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const writeASTFile = require("./writeASTFile")

const defaultOpt = {
  catchCode: identifier => `console.error('😭 我大意了啊没有闪',${identifier})`,
  identifier: "e",
  finallyCode: null
};

let async = `
const ms1 = async () => await fff()

let msg = '';

async function funMsg1() {
  msg = await asyncFunc()
  console.log(msg)
}

async function funJudge() {
  let a = 1
  if (a === 1) {
    let data = await asyncFunc()
    console.log(data);
  }
}

async function func() {
  const result = await asyncFunc()
  const result1 = await asyncFunc()
  console.log(result1)
}

async function fun() {
  await asyncFunc()
}

const ms = async () => {
  await asyncFunc()
  await test()
}

async function tryFn() {
  try {
    await asyncFunc();
  } catch (e) {
  }
}

async function funProRes() {
  await new Promise((resolve, reject) => resolve(1)).then((data) => {
    console.log(data)
  })
}

const manyFun = () =>{
 const result = async ()=>{ await fn()}
}

async function funProReject() {
  await Promise.reject(1212)
}
`

function asyncCatchLoader(source) {

  let ast = parse(source, {
    sourceType: "module", // 支持 es6 module
    plugins: ["dynamicImport"] // 支持动态 import
  });

  let options = [...arguments].splice(1);
  options = {
    ...defaultOpt,
    ...options[0]
  };

  if (typeof options.catchCode === "function") {
    options.catchCode = options.catchCode(options.identifier);
  }
  let catchNode = parse(options.catchCode).program.body;
  let finallyNode = options.finallyCode && parse(options.finallyCode).program.body;

  const catchClause = t.catchClause(
    t.identifier(options.identifier),
    t.blockStatement(catchNode)
  )

  const visitor = {
    // await的部分
    AwaitExpression(path) {
      // 判断是否已经包过tayCatch    findParent 上一级的ast
      if (path.findParent((path) => t.isTryStatement(path.node))) return;
      // 后面跟着promise不需要捕获错误
      if (t.isMemberExpression(path.node.argument.callee) && path.node.argument.callee.object.name === "Promise") return;
      if (t.isNewExpression(path.node.argument.callee.object)) return;

      /*------- 1. 当赋值给声明的变量 ||  赋值变量 ---------*/
      if (t.isVariableDeclaration(path.parentPath.parent) || t.isAssignmentExpression(path.parentPath)) {
        let tryCatchAst = t.tryStatement(
          t.blockStatement(path.parentPath.parentPath.parentPath.node.body), // path.scope.block.body.body
          catchClause,
          finallyNode && t.blockStatement(finallyNode)
        );
        path.parentPath.parentPath.parentPath.replaceWithMultiple([tryCatchAst])
        return
      }

      /*------- 2. 带有return 返回的 ---------*/
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

      /*------  3.  直接返回 async ()=> await fn() ---------*/
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

        // let tryCatchAst = t.blockStatement([
        //   t.returnStatement(path.node)
        // ]);
        // let tryCode = t.arrowFunctionExpression([], tryCatchAst, true)

        path.replaceWith(tryCatchAst)
        return false;
      }

      /*------- 4. 直接使用 ---------*/
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
  writeASTFile(ast); // 写入到js文件
  console.log('\x1B[33m%s\x1B[0m', '✔ over')
  return generator(ast).code
}

asyncCatchLoader(async);

// module.exports = asyncCatchLoader

/*
* 因为replaceWithMultiple给ast加了await表达式，又触发了AwaitExpression
*
* */

// console.log(path.container); // 当前容器
// console.log(path.parent); // 父级容器
// let tryCatchAst = t.tryStatement(
//   t.blockStatement([
//     t.expressionStatement(node)
//   ]),
//   t.catchClause(
//     t.identifier('e'),
//     t.blockStatement([
//       t.expressionStatement(
//         t.callExpression(
//           t.memberExpression(t.identifier('console'), t.identifier('log')), [t.identifier('e')]
//         )
//       )
//     ])
//   ),
//   finallyNode && t.blockStatement(finallyNode)
// )
//
// path.replaceWithMultiple([tryCatchAst])