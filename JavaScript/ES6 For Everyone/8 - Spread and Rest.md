### MODULE #8
# Say Hello to ...Spread and ...Rest
講者: [wesbos](https://github.com/wesbos) - [ES6 for Everyone](https://es6.io/)

# Outline
* [Spread](#spread)
    1. [Array Literal](#array-literal)
    2. [Function Calls](#function-calls)
* [Rest](#rest)
    1. [Destructuring](#destructuring)
    2. [Parameters in Function](#parameters)

## <a name="spread"></a>Spread
針對**iterable** object (e.g. `Array`)，分成兩種case:

### <a name="array-literal"></a>1. Array Literal
#### Syntax
```javascript
const iterableObj = [1, 2, 3];
[...iterableObj, 4, 5, 6] // [1, 2, 3, 4, 5, 6]
```

#### Example 1:
```javascript
const boys = ['James', 'Mark', 'Tom'];
const girls = ['Amy', 'Tina', 'Lux'];
const teacher = 'Josh';

// 使用兩個Array，中間加上一個string，建立新Array
const myClass = [...boys, teacher, ...girls]; // ["James", "Mark", "Tom", "Josh", "Amy", "Tina", "Lux"]

// 等同於
// let myClass = [];
// myClass = myClass.concat(boys);
// myClass.push(teacher);
// myClass = myClass.concat(girls);
```

#### Example 2 (Array Copy):
接續Example 1:

```javascript
// const newClass = myClass // (X)，指向同一Array

const newClass = [...myClass]; // ["James", "Mark", "Tom", "Josh", "Amy", "Tina", "Lux"]
// myClass和newClass是各自獨立的Array
```

#### Example 3 (做為`Array.from()`的替代方法)
```javascript
const arr = [...iterableObj];
// 等同於
const arr = Array.from(iterableObj);
```

#### Example 4 (產生html tag):
```javascript
function spanWrap(word) {
    return [...word].map(letter => `<span>${letter}</span>`).join(' ');
}

spanWrap('Tom') // "<span>T</span> <span>o</span> <span>m</span>"
```

#### Example 5 (從`Array`中移除特定element後建立新`Array`)
```javascript
// Redux常見
const students = [
    { id: 1, name: 'James', score: 90 },
    { id: 2, name: 'Mark', score: 50 },
    { id: 3, name: 'Tom', score: 70 }
];

const id = 2;
const removedIndex = students.findIndex(student => student.id === id);
// 關鍵: 配合.slice和index
const result = [...students.slice(0, removedIndex), ...students.slice(removedIndex + 1)];

console.log(result);
// [{ id: 1, name: 'James', score: 90 }, { id: 3, name: 'Tom', score: 70 }]
```

*__Note:__ 若這邊可以修改原`Array`，用`students.splice(removedIndex, 1)`比較快*

### <a name="function-calls"></a>2. Function Calls
#### Syntax
```javascript
const iterableObj = [1, 2, 3];
myFunction(...iterableObj); // myFunction(1, 2, 3)
```

#### Example
```javascript
const students = ['James', 'Mark', 'Tom'];
const newStudents = ['Jane', 'Rose'];

// students.push(newStudents); // ['James', 'Mark', 'Tom', ['Jane', 'Rose']]，不是我們要的
// students.push.apply(students, newStudents); // ['James', 'Mark', 'Tom', 'Jane', 'Rose']，冗長不易讀

students.push(...newStudents); // ['James', 'Mark', 'Tom', 'Jane', 'Rose']，OK!
```

## <a name="rest"></a>Rest
### <a name="destructuring"></a>1. Destructuring
先前提過，參考[destructuring](5 - Destructuring.md#array)

### <a name="parameters"></a>2. Parameters in Function
```javascript
function sayHello(greet, ...names) {
    for (const name of names) {
        console.log(`${greet} ${name}!`);
    }
}

sayHello('Hi', 'James')
Hi James!

sayHello('Hello', 'James', 'Tom')
Hello James!
Hello Tom!
```

*__Note:__ `...params`一定要是"最後一個"parameters*

#### vs `arguments`
1. `...params`就是`Array`，不需要再轉換
2. 如上面的例子，function的pamameters仍然可以先給定幾個 (e.g. `greet`)，其它多的才會被塞到`...names`，若用`arguments`就需要自行處理index
