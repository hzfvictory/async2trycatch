# async2trycatch

## Install
```
yarn add async2trycatch -D
```
## Usage
```
// webpack.config.js

module: {
    rules: [
        {
            test: /\.js$/,
            use:{
                loader:'async2trycatch',
                options:{
                }
            }
        }
    ]
}
```
## Options


| Name              | Type       | Default              | Description                    |
| ----------------- | ---------- | -------------------- | ------------------------------ |
| **`identifier`**  | `{string}` | `"e"`                | `catch 子句中的错误对象标识符` |
| **`catchCode`**   | `{string}` | `"console.error(e)"` | `catch 子句中的代码片段`       |
| **`finallyCode`** | `{string}` | `undefined`          | `finally 子句中的代码片段`     |

