# Objects and Functions
from [JavaScript: Understanding the Weird Parts](https://www.udemy.com/understand-JavaScript/learn/v4/overview)

不像其它的語言，object和function在JavaScript的關聯性非常強 (在許多方面，甚至可以視為同一個主題)，因此這邊放到一起來學習

## Objects and the Dot
### Object的架構:
<img src="./res/Ch03/Object.jpeg">

一個object (name / value pairs)，本身在memory space中佔有空間(0x001)，可以持有property和method

* Property: 可以單純是primitive，或為另一個object
* Method: 由object持有的function稱為method

它們也會在在memory space中佔有空間(0x002 ~ 0x004)，object本身保存的是它們空間位址的**references**

### 存取object的properties或methods
有兩種方式 (operators，precedence僅次於grouping):

1. Member Access (`.`)
2. Computed Member Access (`[...]`)

```javascript
var person = new Object(); // 這邊先暫時用new的方式宣告比較清楚，一般來說建議使用literal: {}
// 設值
person.firstname = "James";
person["lastname"] = "Yu";
// 取值
console.log(person.firstname);
console.log(person["lastname"]);
```

兩種方式基本上都可以，差別在於

**Member Access (`.`) 後面直接接"string"的properties name，不可接variable**

```javascript
// person: {firstname: "James", lastname: "Yu"}
var firstNameProperty = "firstname";
console.log(person.firstname); // James，等同於person["firstname"]
console.log(person.firstNameProperty); // undefined，等同於person["firstNameProperty"]
```

**Computed Member Access (`[...]`) 中可以是variable或expression**

```javascript
// person: {firstname: "James", lastname: "Yu"}
var firstNameProperty = "firstname";
console.log(person.firstNameProperty); // undefined，等同於person["firstNameProperty"]
console.log(person[firstNameProperty]); // James，等同於person["firstname"]
```

#### 注意nested properties
```javascript
// person: {firstname: "James", lastname: "Yu"}
person.address = new Object(); // address是person的object property
person.address.city = "Taipei"; // 可以
```

拿掉`person.address = new Object();`

```javascript
// person: {firstname: "James", lastname: "Yu"}
person.address.city = "Taipei"; // Error，person.address是undefined，等同試圖存取undefined.city
```

## Objects and Object Literals

```javascript
// Object Literals: 建議使用
var person = { firstname: 'James', lastname: 'Yu'};
// 等同於
var person = new Object();
person.firstname = 'James';
person.lastname = 'Yu';
```

### Faking Namespaces
*__Namespace: A container for variables and functions.__*

**JavaScript沒有namespace**，這是因為利用object就可以簡單做到

```javascript
// 衝突
var greet = 'hello';
var greet = 'hola';

// 改用object做為container
var english = {};
var spanish = {};
english.greet = 'hello';
spanish.greet = 'hola';

// 類似階層式的namespace
var chinese = {
  greetings: {
      basic: '嗨'
  }  
};
```

## JSON and Object Literals
JSON (JavaScript Object Notation)，是以JavaScript的object literal syntax的概念設計

因此它們看起來非常像，但是**若誤會兩者是一樣的東西，容易發生問題**

**JSON可以想像成是object literal的subset** (JSON較嚴格)，也就是說，JSON可以，object literal也可以，但是反過來不一定

例如，JSON的name一定要用`""`包起來，JavaScript可接受但不一定要:

```javascript
// 符合JSON和JavaScript的標準
{
    "firstname": "James",
    "isAProgrammer": true
}
// 不符合JSON的標準，但是JavaScript的標準做法
{
    firstname: "James",
    isAProgrammer: true
}
```

### Object轉JSON
```javascript
var person = {
    "firstname": "James",
    "isAProgrammer": true
}

var jsonString = JSON.stringify(person)); // string

```

### JSON轉Object
```javascript
var jsonValue = JSON.parse('{ "firstname": "James", "isAProgrammer": true }') // object
```

## Functions are Objects
*__First class function: Everything you can do with other types, you can do with function__*

Assign給variable，當成參數傳遞，使用literal syntax建立function...etc.為[functional programming](https://en.wikipedia.org/wiki/Functional_programming)的重要特性

### Function的架構:
<img src="./res/Ch03/Function.jpeg" width="400">

<font color="red">Function就是object</font>，除了一般object的特性外，多了兩種特別的properties:

1. **Name (optional):**

    若為匿名function的話可以沒有
    
2. **Code:**

    有個很重要的概念是，**所謂的function code就只是function object的其中一個property而已**

    而它是invocable的，也就是說我們可以透過`()`來呼叫，JavaScript engine會建立execution context執行放在其中的code

### Function Statements and Function Expressions
*__Expression:__ A unit of code that results in a value.*

```javascript
// Expression
var a = 3; // return 3
1 + 2; // return 3，expression不一定要設值

// Statement
if (a === 3) {...} // if statement，單純執行工作，不return value (裡面的a === 3是expression)
```

由於function是object，因此可以透過function statement以及function expression兩種不同的方式來使用

<img src="./res/Ch03/Function Statement.jpeg" width="400">
<img src="./res/Ch03/Function Expression.jpeg" width="450">

注意像下面的case:

```javascript
// Function Statement
greet(); // hi

function greet() {
    console.log('hi');
}

// Function Expression
myGreet(); // Error: undefined is not a function

var myGreet = function() {
    console.log('hi');
}
```

這是因為execution context在creation階段的時候，function `greet`已經被標記為`function`

但variable`myGreet`在creation階段是`undefined`，所以在execution階段跑到`myGreet()`的時候就會丟error，若改成:

```javascript
var myGreet = function() {
    console.log('hi');
}
myGreet(); // hi，沒問題
```

## By Value vs By Reference
有些語言可以選，JavaScript沒得選

**Primitives就是by value / Objects就是by reference**

<img src="./res/Ch03/By value.jpeg" width="700">

<img src="./res/Ch03/By reference.jpeg" width="700">

## Objects, Functions, and 'this'
如先前所提，每當invoke一個function的時候，新的execution context會被建立，放到execution stack

現在該來看看execution context中的**`this`**是什麼了

`this`指向什麼會由function的位置以及function是如何被invoked的來決定

### Global Level
```javascript
console.log(this); // window
```

```javascript
function a() {
    console.log(this); // window
}

var b = function() {
    console.log(this); // window
}

a();
b();
```

### Method Level
```javascript
var c = {
    name: 'The c object',
    log: function() {
        this.name = 'Update the c object';
        console.log(this); // this: object c
    }
}

c.log();
```

注意下面這個case:

```javascript
var c = {
    name: 'The c object',
    log: function() {
        this.name = 'Update the c object';
        console.log(this);
        
        var setname = function(newname) { // 注意，這個function不屬於method level
            this.name = newname; // 因此這裡的this: window (Global)
        }
        setname('Updated again! The c object'); // 變成window.name: 'Updated again! The c object'
        console.log(this); // this: object c，c的name沒有被改
    }
}

c.log();
```

**可以改成 (這個pattern非常常見):**

```javascript
var c = {
    name: 'The c object',
    log: function() {
        var self = this; // self指向object c，接下來我一律使用self就不用多去想this指向誰了
        
        var setname = function(newname) {
            self.name = newname;
        }
        setname('Updated again! The c object');
        console.log(self); // object c的name變成'Updated again! The c object'
    }
}

c.log();
```

*__Additional:__ `let` keyword可以解決這個問題而不需要多一層`self`，之後會提到*

## Array
**Array和Function一樣都是特殊的object**

有別於一般的object使用name做為index來存取，array表現地像是使用number index來存取

### Array的架構:
其實是把element存成array object的property，index就是property name

並且額外擁有一些像是`join`、`push`之類的array methods

<img src="./res/Ch03/Array.jpeg" width="350">

### JavaScript中沒有所謂關聯式陣列 (Associative Array，使用name index的array)
Array永遠"只"使用number當作index

如果你設了name index，array內建的properties和methods可能導致非預期的結果 **(DO NOT do this!)**

```javascript
var arr = [1, 2];

arr["hello"] = "hi"; // 現在arr為[1, 2, hello: "hi"]
console.log(arr[0]); // 1
console.log(arr.hello); // hi
console.log(arr.length); // 2，而非3 (非預期)
console.log(arr.join()); // "1, 2"，而非"1, 2, hi" (非預期)

arr[2] = "hi"; // 現在arr為[1, 2, "hi", hello: "hi"]
console.log(arr.length); // 3，而非4 (非預期)
```

## `arguments` and Spread (`...`)
### `arguments`
*__Arguments: The parameters you pass to a function.__*

JavaScript gives you a **keyword of the same name** which contains them all.

```javascript
function myConcat() {
    if (arguments.length === 0) {
        console.log('Missing parameters!');
        return;
    }
    for (var i = 0; i < arguments.length; i++) {
        console.log(i + ": " + arguments[i]);
    }
}
 
myConcat("red", "orange", "blue");
// Output:
// 0: red
// 1: orange
// 2: blue
```

*__Note:__* `arguments`這個是"array-like"，而不是真正的array

它擁有number index和length等properties，但並沒有全部array的methods，所以不能做像是`arguments.join()`之類的array操作

*__Note:__* `arguments`在現行libraries中常用所以要了解，但ES6之後應該用spread (`...`)來代替

### Spread (`...`)
有兩種使用方法:

#### 1. 用在function的arguments中，取代`arguments`
```javascript
function log(first, second, ...others) {
    console.log(first);
    console.log(second);
    console.log(others.join(' and ')); // 就是array，可以使用array method
}

log('James'); // "James", undefined, ""
log('James', 'Mark', 'Tom', 'Jason'); // "James", "Mark", ["Tom", "Jason"]
```

#### 2. 用在array elements的展開
```javascript
var arr = ['James', 'Mark'];
console.log([arr, 'John']); // [['James', 'Mark'], "John"]
console.log([...arr, 'John']); // 使用spread: ["James", "Mark", "John"]
```

## Function Overloading
**JavaScript沒有function overloading**，但是有許多方法可以做到類似的事情，以下為**其中一種**常見的pattern:

```javascript
function greet(firstname, lastname, language) {
    language = language || 'en';
    
    if (language === 'en') {
        console.log('Hello ' + firstname + ' ' + lastname);   
    }
    if (language === 'es') {
        console.log('Hola ' + firstname + ' ' + lastname);   
    }
}

function greetEnglish(firstname, lastname) {
    greet(firstname, lastname, 'en');   
}

function greetSpanish(firstname, lastname) {
    greet(firstname, lastname, 'es');   
}

greetEnglish('John', 'Doe');
greetSpanish('John', 'Doe');
```

## Syntax Parsers
這邊給一個簡單的概念說明syntax parsers的工作，對於了解下面的內容有幫助

我們寫好的code並不是在computer上真正執行的樣子，而是由syntax parsers先做類似翻譯的動作

#### Syntax Parsers:
**一個一個character依序讀取**你的code，依照事先定義好的規則，決定:

1. 是否為valid syntax，否則丟error
2. 根據你的意圖，做相對應的處理 (**有可能在code真正執行前改變它**)

## Dangerous Aside: Automatic Semicolon Insertion




## Framework Aside: Whitespace
## Immediately Invoked Functions Expressions (IIFEs)
## Framework Aside: IIFEs and Safe Code
## Understanding Closures
## Understanding Closures - Part 2
## Framework Aside: Function Factories
## Closures and Callbacks
## call(), apply(), and bind()
## Functional Programming
## Functional Programming - Part 2
