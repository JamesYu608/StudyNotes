### MODULE #6
# Iterables & Looping
講者: [wesbos](https://github.com/wesbos) - [ES6 for Everyone](https://es6.io/)

# Prior Knowledge
1. [var / let / const，在for Loop中的差異](var_let_const_for Loop.md)
2. [MODULE #11 - Symbols](11 - Symbols.md)
3. [MODULE #16 - Generators](16 - Generators.md)

# Outline
* [Introduction of Iterable / Iterator](#intro)
    * [Iterable Object](#iterable)
    * [Iterator Object](#iterator)
    * [Generator object同時是Iterable和Iterator object](#generator)
    * [Built-in的iterable object](#built-in)
* [The for of Loop in Array: 四種方法](#for-of-array)
* [Array.entries](#array-entries)
* [Using for...of with Objects (X)](#object)

## <a name="intro"></a>Introduction of Iterable / Iterator
`for...of`可以走訪所謂的"iterable object"，所以先學習什麼是iterable

### <a name="iterable"></a>Iterable Object
有實作[iterable protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable)的object，也就是:

1. **Key:** `Symbol.iterator`
2. **Value:** 一個不帶參的"function"，回傳"iterator object"

#### User-defined iterable object
```javascript
const obj = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3,
    [Symbol.iterator]: Array.prototype[Symbol.iterator] // 借Array的實作來用
};

for (const item of obj) {
    console.log(item); // a, b, c
}
```

### <a name="iterator"></a>Iterator Object
有實作[iterator protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterator)的object，也就是:

1. **Keys:** `next`
2. **Value:** 一個不帶參的"function"，回傳擁有下列兩個properties的"object":
    1. **Keys:** `done` / **Value:**: `boolean`
    2. **Keys:** `value` / **Value:**: any，若`done`為true可以是`undefined`

#### User-defined iterator object
```javascript
// 模仿array，但是倒著尋訪
const obj = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3,
    [Symbol.iterator]: function() { // Iterable
        let index = this.length - 1;
        return { // Iterator
            next: () => {
                let value = this[index];
                let done = index < 0;
                index--;
                return { value, done };
            }
        };
    }
};
for (const item of obj) {
    console.log(item); // c, b, a
}
```

### <a name="generator"></a>Generator object同時是Iterable和Iterator object
```javascript
function* gen() {
    yield 'Hello, ';
    yield 'world!';
}

const hello = gen();
```

#### Iterable
`hello`擁有(繼承)了`[Symbol.iterator]`:

```javascript
for (const word of hello) { // Iterable，可以使用for...of
    console.log(word);
}
// Output
Hello, 
world!
undefined
```

#### Iterator
`hello`擁有(繼承)了`next`:

```javascript
hello.next() // {value: "Hello, ", done: false}
hello.next() // {value: "world!", done: false}
hello.next() // {value: undefined, done: true}
```

#### 利用Generator建立Iterable object
```javascript
const myIterable = {
   [Symbol.iterator]: function* () {
       yield 1;
       yield 2;
       yield 3;
   }
}; 

for (const value of myIterable) {
    console.log(value); // 1, 2, 3
}
```

### <a name="built-in"></a>Built-in的iterable object
參考[`Symbol.iterator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator)

1. `Array`
2. `TypedArray`
3. `String`
4. `Map`
5. `Set`
6. `arguments`: 不需要轉成`Array`就可以使用`for...of`

## <a name="for-of-array"></a>The for of Loop in `Array`
```javascript
const names = ['James', 'Mark', 'Tom', 'John'];
```

總共有四種方法走訪`Array`:

#### 法一 (`for...of`: **建議**)
```javascript
for (const name of names) {
    if (name === 'Mark') {
        break; // 可以
    }
    console.log(name);
}
```

#### 法二 (`forEach`: **考慮**):
缺點: 不能使用`break`或`continue` (因為是callback function，不是for loop)，若不需要的話是好方法

```javascript
names.forEach(name => {
    console.log(name);
    if (name === 'Mark') {
        break; // Error
    }
});
```

#### 法三 (`length`: **Old School Style**):
缺點: Syntax複雜

```javascript
for (let i = 0; i < names.length; i++) {
    console.log(names[i]);
}
```



#### 法四 (`for...in`: **不要使用**):
缺點: 如先前所提，會走訪`Array.prototype`的properties，就算自己沒有修改，也可能有其它library動到

```javascript
for (const index in names) { // 取得的是properties names
    console.log(names[index]);
}
```

## <a name="array-entries"></a>`Array.entries`
這個function可以取得一個iterator object，每次回傳"array": `[index, value]`

```javascript
for (const iter of names.entries()) {
    console.log(iter);
}
// Output
[0, "James"]
[1, "Mark"]
[2, "Tom"]
[3, "John"]
```

直接使用destructuring來接回傳的array:

```javascript
for (const [i, name] of names.entries()) {
    console.log(`${i}: ${name}`);
}
// Output
0: James
1: Mark
2: Tom
3: John
```

## <a name="object"></a>Using `for...of` with Objects (X)
不能在一般object上直接使用`for...of`，也沒有`Object.entries`:

```javascript
const james = {
    name: 'James',
    age: 28
};

for (const prop of james) { // TypeError: james[Symbol.iterator] is not a function
    console.log(prop);
}

// ES7才支援`Object.entries`
```

可以使用`Object.keys(obj)`來走訪object的properties:

```javascript
for (const prop of Object.keys(james)) {
    console.log(james[prop]);
}
```

*__Note:__ 在ES7之前，要做這樣的操作，不如直接使用`for...in`*
