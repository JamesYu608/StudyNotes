# Odds and Ends
from [JavaScript: Understanding the Weird Parts](https://www.udemy.com/understand-JavaScript/learn/v4/overview)

這個chapter只筆記`typeof`和`instanceof`的部分，另外兩個跳過的section:

1. Initialization (在說JavaScript中初始化object的時候，容易犯下搞混`:`和`=`、漏掉`,`等錯誤)
2. Strict Mode

## 'typeof' , 'instanceof', and Figuring Out What Something Is
### [`typeof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof) (檢查型別，不含prototype)
`typeof`是operator，回傳**string**

#### Primitive

```javascript
typeof undefined // "undefined"
typeof true // "boolean"
typeof 3 // "number"
typeof 'James' // "string"
```

`null`的case (歷史因素):

```javascript
typeof null // "object"
```

Wapper object是object:

```javascript
typeof new Number(3) // "object"
typeof new String('James') // "object"
```

#### Functions and Objects
```javascript
// Functions
typeof function(){} // "function"
typeof class C {} // "function"

// Objects
typeof {name: 'James'} // "object"
```

`typeof`不會顯示繼承關係 (要用`instanceof`):

```javascript
function Person(name) {
    this.name = name;
}

var james = new Person('James');

typeof james // "object"，不是"Person"
```

`Array`的case，要小心回傳的並不是"array"而是"object":

```javascript
arr = [1, 2, 3];
typeof arr // "object"，沒有幫助
Object.prototype.toString.call(arr) // "[object Array]"，可以判斷
```

像是[`Array.isArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)底層就是用`Object.prototype.toString.call(arg) === '[object Array]'`實作的


### [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) (檢查prototype chain)
`instanceof`是operator，檢查object的prototype chain是否有包含特定function的`.prototype` (作為constructor function)

```javascript
function Person(firstname, lastname) {
    this.firstname = firstname;
    this.lastname = lastname;
}

var james = new Person('James', 'Yu');

james instanceof Person // true，james.__proto__ = Person.prototype
james instanceof Object // true，Object也在prototype chain中
```

注意`instanceof`後只能接受function:

```javascript
var person = {
    firstname: 'Default',
    lastname: 'Default'
};

var james = {
    firstname: 'James'
};

james instanceof person
VM2395:1 Uncaught TypeError: Right-hand side of 'instanceof' is not callable
```
