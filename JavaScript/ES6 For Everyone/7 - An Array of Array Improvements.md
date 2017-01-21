### MODULE #7
# An Array of Array Improvements
講者: [wesbos](https://github.com/wesbos) - [ES6 for Everyone](https://es6.io/)

# Outline
* [`Array.from()` and `Array.of()`](#from-of)
    * [Array-Like](#array-like)
* [`.find()` and `.findIndex()`](#find)
* [`.some()` and `.every()`](#some-every)

## <a name="from-of"></a>`Array.from()` and `Array.of()`
### `Array.from()`
使用**"array-like"**的object，建立真正的`Array`

#### <a name="array-like"></a>Array-Like
以下兩種為array-like objects:

1. 擁有`length` propertey以及indexed elements的object
2. Iterable object

若兩者同時符合，`Array.from()`以Iterable的實作為優先

```javascript
function sum() {
    return arguments.reduce((prev, next) => prev + next); // Error，arguments不是Array
}
```

```javascript
function sum() {
    const numbers = Array.from(arguments);
    return numbers.reduce((prev, next) => prev + next); // Ok，numbers是Array
}
```

#### 可以同時使用mapping function建立Array
```javascript
const names = ['James', 'Mark', 'Tom'];

// 在第二個argument傳入mapping function
Array.from(names, name => name + ' Yu') // ["James Yu", "Mark Yu", "Tom Yu"]
```

### `Array.of()`
除了不用`[ ]`來建立`Array`以外，沒有特別的

```javascript
Array.of(10, 20, 30); // [10, 20, 30]
```

## <a name="find"></a>`.find()` and `.findIndex()`
```javascript
const students = [
    {
        name: 'James',
        score: 90
    },
    {
        name: 'Mark',
        score: 50
    },
    {
        name: 'Tom',
        score: 70
    }
];
```

### `.find()`
找到第一個match的element

```javascript
students.find(element => element.score > 60) // {name: "James", score: 90}

// vs .filter()
students.filter(element => element.score > 60)
// [{name: "James", score: 90}, {name: "Tom", score: 70}]，回傳的是Array
```

### `.findIndex()`
用法同`.find()`，但是回傳的是element的index

```javascript
students.findIndex(element => element.score < 60) // 1
```

## <a name="some-every"></a>`.some()` and `.every()`
```javascript
const ages = [18, 36, 12, 20];
```

### `.some()`
**只要有一個**element符合就回傳`true`

```javascript
ages.some(age => age > 18) // true
```

### `.every()`
**全部**elements符合就回傳`true`

```javascript
ages.every(age => age > 18) // false
ages.every(age => age > 10) // true
```
