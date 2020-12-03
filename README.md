# async2tryCatch

## Install
```javascript
yarn add async2tryCatch -D
```
## Usage
```javascript
// webpack.config.js

module: {
    rules: [
        {
            test: /\.js$/,
            use:{
                loader:'async2tryCatch',
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

