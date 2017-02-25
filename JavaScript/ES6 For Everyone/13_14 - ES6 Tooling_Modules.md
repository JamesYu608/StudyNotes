### MODULE #13、14
# ES6 Tooling & JavaScript Modules
講者: [wesbos](https://github.com/wesbos) - [ES6 for Everyone](https://es6.io/)

# Outline
* [ES6 Tooling](#tooling)
    * [WebPack 2](#webpack)
    * [Babel](#babel)
    * [SystemJS & BrowserSync](#systemjs-browserSync)
    * [Polyfilling ES6 for Older Browsers](#polyfilling)
* [JavaScript Modules](#module)
    * [Default](#default)
    * [Name](#name)

# <a name="tooling"></a>ES6 Tooling
## <a name="webpack"></a>WebPack 2
參考: [React 開發環境設置與 Webpack 入門教學](https://github.com/kdchang/reactjs101/blob/master/Ch02/webpack-dev-enviroment.md)

以下簡單示範webpack + bable的安裝、設定

會需要帶到babel的原因，是要做為webpack中的一個module loader，處理`.js`中ES6語法對較舊browser的支援

#### 1. 安裝webpack2 + babel:
```bash
npm install webpack@beta babel-loader babel-core babel-preset-es2015-native-modules --save-dev
```

#### 2. `webpack.config.js`
```javascript
// webpack是用NodeJS去run，需要使用require而不是ES6的import
const webpack = require('webpack');
// 區分dev和release的build configuration
const nodeEnv = process.env.NODE_ENV || 'production';

module.exports = {
    // 用來還原minify或uglify後的檔案
    devtool: 'source-map',
    // 從app.js做為進入點，"所有相關"的module會被一起預處理、打包成bundle.js
    entry: {
        filename: './app.js'
    },
    output: {
        filename: '_build/bundle.js'
    },
    module: {
        // loaders的目的是處理指定類型的檔案，這邊我們用babel處理所有.js檔
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/, // 忽略node_modules中的檔案
                loader: 'babel-loader',
                query: {
                    presets: ['es2015-native-modules']
                }
            }
        ]
    },
    plugins: [
        // Minify & Uglify
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            },
            sourceMap: true
        }),
        // 這邊設定env是給webpack用的，例如上面的UglifyJsPlugin在dev或release會做對應處理
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
        })
    ]
};
```

#### 3. npm script
`package.json`:

```json
"scripts": {
    "build": "webpack --progress --watch" // 執行webpack並且持續監控檔案的修改
}
```

#### 4. Run
```bash
npm run build
```

現在我們可以看到`bundle.js`已經被compile出來

因此可以修改`index.html`中的`app.js`，替換成:

```html
<script src="_build/bundle.js"></script>
```

## <a name="babel"></a>Babel
上面使用webpack + babel做為一個常見的配置

但若不需要打包module的話，babel其實不一定要跟webpack，可以獨立使用

它做的事就是將較新的 (e.g. ES6) syntax，轉換成舊版browser也能支援的格式，例如:

```javascript
function sayHello(name) {
  console.log(`Hello, ${name}!`); // ES6: Template String
}
// 轉換
function sayHello(name) {
  console.log("Hello, " + name + "!"); // ES5: 99% browser通用
}
```

#### install
```bash
npm install babel-cli babel-preset-es2015 --save
```

* `babel-cli`: 讓我們可以在command或npm script呼叫babel
* `babel-preset-es2015`: 從[babel-plugins](https://babeljs.io/docs/plugins/)可以看到光是ES6的部分，就有許多features可以選擇使用，若我們沒有要要一項項挑選，可以直接使用**preset**一次指定整個ES6的features

#### npm script
```javascript
// Input: app.js / Output: app-compiled.js
"scripts": {
    "babel": "babel app.js --watch --out-file app-compiled.js"
}
```

現在使用`npm run babel`還沒有用，我們還需要設定babel的configuration

#### `.bablerc`
可以設定的參數參考: [Options](https://babeljs.io/docs/usage/api/#options)

有兩種方法，可以直接建立`.bablerc`，或是**寫在`package.json`中 (建議)**

```javascript
"babel": {
    "presets": ["es2015"]
}
```

現在使用`npm run babel`，會產生babel處理後的檔案

## <a name="systemjs-browserSync"></a>SystemJS & BrowserSync
* `SystemJS`: 跟webpack相比屬於**輕量級**的module loader，並且可以**動態** (不需install) 載入module
* `BrowserSync`: 可以快速run一個簡單的server並監控檔案變化

使用`SystemJS` + `BrowserSync`可以快速建置一個測試環境

#### SystemJS
這邊我們使用CDN的方式來import:

```html
    // CDN
    <script src="https://jspm.io/system@0.19.js"></script>
    // Config
    <script>
        System.config({ transpiler: 'babel' });
        System.import('./app.js');
    </script>
```

動態載入module:

```javascript
import { kebabCase } from 'npm:lodash'; // 不需要事先npm install lodash

console.log(kebabCase('Hello, world!'));
```

#### BrowserSync
Install:

```bash
npm install browser-sync --save-dev
```

Script:

```javascript
"scripts": {
    "server": "browser-sync start --directory --server  --files '*.js, *.html, *.css'"
}
// npm run server
```

## <a name="polyfilling"></a>Polyfilling ES6 for Older Browsers
Babel只能convert新版JavaScript的syntax

若是使用ES6的`Array.from()`，babel只會假設你有，不會幫忙產生

可以自己實作[polyfill](
https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Polyfill)，也可以透過兩種方式

#### 1. [Babel Polyfill](https://babeljs.io/docs/usage/polyfill/)
但若不需要載入全部polyfill，或是環境沒有`import` / `require`可以使用，可以透過第二種方式

#### 2. [Polyfill.io](https://polyfill.io/v2/docs/)
它會自己決定要怎麼產生polyfill的檔案

實際透過`https://cdn.polyfill.io/v2/polyfill.js`測試

在我的chrome (最新版):

```
/* No polyfills found for current settings */
```

若從Network conditions -> 勾掉Select automatically -> IE 9，去模擬舊版browser:

```
`* - Array.from, License: CC0 (required by "default")`
...
實作
...
```

# <a name="module"></a>JavaScript Modules
ES6: `export` / `import`的有兩種使用方式: default和name

### <a name="default"></a>Default
**每個module只能有一個default export**

`./src/my-config`:

```javascript
const apiKey = 'abc';
export default apiKey; // default export
```

`app.js`:

```javascript
import KEY from './src/my-config'; // 可以取任何變數名稱，指到該檔案的default export
console.log(KEY); // 'abc'
```

### <a name="name"></a>Name
**每個module可以有多個name export**

`./src/my-config`:

```javascript
export const apiKey = 'abc'; // name export

const url = 'google.com';
export { url }; // 注意不能直接使用export url

export function sayHi() { console.log('hi') } // function statement可以直接export
```

`app.js`:

```javascript
import { apiKey, url } from './src/my-config'; // 放在{}中，名稱一定要一樣，不然會找不到
console.log(apiKey, url);
```

#### Rename
Name import / export非常有可能會產生conflict，所以我們可以使用`as`來rename

Export:

```javascript
export { url as MY_URL };
```

Import:

```javascript
import { apiKey as MY_KEY , MY_URL } from './src/my-config';
```
