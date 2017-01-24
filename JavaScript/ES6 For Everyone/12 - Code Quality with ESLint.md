### MODULE #12
# Code Quality with ESLint
講者: [wesbos](https://github.com/wesbos) - [ES6 for Everyone](https://es6.io/)

# Outline
* [Getting Started with ESLint](#start)
* [常用的configuration](#config)
* [Scope](#scope)
* [ESLint Plugins](#plugins)
* [Only Allow ESLint Passing Code into your git repos](#git)

## <a name="start"></a>Getting Started with ESLint
#### Install
```bash
# 需要先安裝NodeJS跟npm
$ npm install -g eslint
$ eslint --version
```

#### Init & Run
在project下:

```bash
$ eslint --init
```

會建立一個`.eslintrc.json`的檔案，表示ESLint的configuration

然後就可以用:

``` bash
$ eslint file_name.js # 支援wildcard，例如*.js
```

來檢查你的code

#### Fix

```bash
$ eslint file_name.js --fix
```

可以自動修正大部份的錯誤

## <a name="config"></a>常用的configuration
以下面這個`.eslintrc.json`為例:

```json
{
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended"
}
```

### `env`
用來設定你的project會用到哪些library，主要是為了判斷`global` variable

例如run在browser中，就會有`window`，有用到jQuery，就會有`$`

參考: [Specifying Environments](http://eslint.org/docs/user-guide/configuring#specifying-environments)

### `extends`
最主要的部分，會以這邊設定的code style **rules**來檢查你的code

參考: [Rules清單](http://eslint.org/docs/rules/)

例如使用ESLint官方提供的`eslint:recommended`

可以在[Rules](http://eslint.org/docs/rules/)的頁面，看到在這個code style下，哪些rules會建議或警告

#### Airbnb
不同的code style有不同的rules設定，另一個著名的code style是**[Airbnb](https://github.com/airbnb/javascript) (建議使用)**

安裝 (參考[eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb)):

```bash
(
  export PKG=eslint-config-airbnb;
  npm info "$PKG@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install -g "$PKG@latest"
)
```

這邊原本是`--save-dev`，我改成`-g`，安裝在Global

`.eslintrc.json`:

```json
{
    ...
    "extends": "airbnb" // 改成airbnb
}
```

### `rules`
在選擇code style之後，仍然會常需要調整個別的rules來符合自己或團隊的要求，建議:

1. 不要直接複製別人的rules，慢慢在每次的code checking中建立自己的rules
2. 詳細閱讀被警告的rules，理解原因，確定然後再做調整

```json
{
    ...
    "rules": {
        "no-console": 0,
        "no-unused-vars": 1
    }
}
```

參考: [Configuring Rules](http://eslint.org/docs/user-guide/configuring)

* `"off"` / `0` - 關掉
* `"warn"` / `1` - 變成warn
* `"error"` / `2` - 變成error

## <a name="scope"></a>Scope
### Global
設定`~/.eslintrc`

### Project
在project下設定`.eslintrc`

### File
#### 設定`globals`
雖然在configuration中也可以設定，但講者比較喜歡在個別的檔案設定

在`.js`檔案的開頭:

```javascript
/* globals myLib */
...
myLib.hello(); // 不會警告
```

#### 關掉特定rules / 停用ESLint
以`no-extend-native`為例，在`.js`檔案開頭:

```javascript
/* eslint-disable no-extend-native */
```

若只有`/* eslint-disable */`，則在這個檔案中停用ESLint

### Block & Line
以上面的例子，`/* eslint-disable */`或`/* eslint-disable no-extend-native */`

可以寫在某行之前，然後在其它地方再用`/* eslint-enable */`或`/* eslint-enable no-extend-native */`打開

## <a name="plugins"></a>ESLint Plugins
ESLint可以分析`.js`以外的檔案，例如`.html`或`.md`等等，不過需要使用plugins

需要先安裝，推薦的清單參考[Awesome ESLint](https://github.com/dustinspecker/awesome-eslint)

然後在`.eslintrc.json`:

```json
{
    ...
    "plugins": ["html"]
}
```

*__Note__: `--fix`仍然只有.js適用*

## <a name="git"></a>Only Allow ESLint Passing Code into your git repos
只有通過ESLint的commit才能提交

將project下的`.git/hooks/commit-msg.sample`重新命名為`commit-msg`

內容 (from [wesbos](https://github.com/wesbos/es6.io/blob/master/12%20-%20Code%20Quality%20with%20ESLint/commit-msg.txt)):

```bash
#!/bin/bash
files=$(git diff --cached --name-only | grep '\.jsx\?$')

# Prevent ESLint help message if no files matched
if [[ $files = "" ]] ; then
  exit 0
fi

failed=0
for file in ${files}; do
  git show :$file | eslint $file
  if [[ $? != 0 ]] ; then
    failed=1
  fi
done;

if [[ $failed != 0 ]] ; then
  echo "🚫🚫🚫 ESLint failed, git commit denied!"
  exit $failed
fi
```
