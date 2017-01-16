### MODULE #11
# Symbols
講者: [wesbos](https://github.com/wesbos) - [ES6 for Everyone](https://es6.io/)

1. `symbol`是primitive type
2. 目的是建立一個絕對不會碰撞的identifier (**unique and immutable**)，來作為property name
3. `symbol` properties是non-enumerable (可以使用`Object.getOwnPropertySymbols`)
4. `Symbol` object有許多built-in的`symbol`，例如`Symbol.iterator`

### 1. 建立symbol
使用`Symbol('description')`

*__Note:__ 設計上的考量，`Symbol`雖然是function，但是不能使用`new` (不能做為constructor function)*

```javascript
// Unique
Symbol('James') === Symbol('James') // false
```

### 2. 做為property name
一般不使用`symbol`的話:

```javascript
const james = {
    name: 'James',
    name: 'James Yu' // override
};
// {name: "James Yu"}
```

使用`symbol`:

```javascript
const james = {
    [Symbol('name')]: 'James',
    [Symbol('name')]: 'James Yu'
};
// {Symbol(name): "James", Symbol(name): "James Yu"}，不同的properties
```

### 3. Access
不能直接access

```javascript
james.name // undefined，property name不是string "name"
james[Symbol('name')] // undefined，每次呼叫Symbol(...)都是建立一個新的symbol
```

#### 3.1: 使用`Object.getOwnPropertySymbols`取得object的所有`symbol` properties
由於`symbol` properties是non-enumerable，不能直接用`for...in`

```javascript
for (const value of Object.getOwnPropertySymbols(james)) {
    console.log(james[value]);
}
```

#### 3.2: 將`symbol`在其它地方保存起來，之後可以單獨access

```javascript
const name = Symbol('name');

const james = {
    [name]: 'James'
};

// Access
james[my_name] // "James"
```

**最主要的應用像許多built-in的`symbol` properties，例如`Symbol.iterator`**

```javascript
Symbol.iterator // Symbol(Symbol.iterator)，(built-in)
Symbol.iterator === Symbol('Symbol.iterator') // false
```

`Array`、`Map`等有built-in的`Symbol.iterator`實作來支援`for...of`

```javascript
// 自行實作
var myIterable = {}
myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
};
// 現在myIterable支援for...of
```
