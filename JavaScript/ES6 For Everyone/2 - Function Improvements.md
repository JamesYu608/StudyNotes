### MODULE #2
# Function Improvements: Arrows and Default Arguments
講者: [wesbos](https://github.com/wesbos) - [ES6 for Everyone](https://es6.io/)

# Outline
* [Arrow Functions Introduction](#intro)
* [Arrow Functions and `this`](#this)
    * [When NOT to use an Arrow Function](#dont-use)
* [Default Function Arguments](#default-args)

## <a name="intro"></a>Arrow Functions Introduction
### Arguments
* 不帶: `() => { statements }`

```javascript
setTimeout(() => {
    console.log('Hello!');
}, 1000);
```

* 一個 (小括號可加可不加): `singleParam => { statements }`

```javascript
firstnames.map(name => {
    return `${name} Yu`;
});
```
 
* 多個: `(param1, param2, …, paramN) => { statements }`

### Return value
* 自動return (不加大括號、不用`return`): `(param1, param2, …, paramN) => expression`

```javascript
firstnames.map(name => `${name} Yu`); // ok
firstnames.map(name => { `${name} Yu` }); // 不可以，這樣return undefined

// 想要自動return一個object:
firstnames.map(
    name => ({first: name, last: 'Yu'}) // 在object外面加()
);
```

* 明確return: `(param1, param2, …, paramN) => { return expression; }`

## <a name="this"></a>Arrow Functions and `this`
**Arrow function的`this`是指向lexical environment (parent scope) 的`this`**

不因function呼叫的地方(做為function或method)、strict mode等因素而有不同

```javascript
const james = {
    name: 'James',
    greet: function() { // 若用()，this會指向james {...} 中的this，也就是global
        console.log(`Hello ${this.name}!`); // 現在this是指向james
        setTimeout(() => { // this指向parent的this，也就是james
            console.log(`Nice to meet you ${this.name}!`);
        }, 1000);
    }
}
james.greet();

// Output
Hello James!
Nice to meet you James!
```

### <a name="dont-use"></a>When NOT to use an Arrow Function
* `element.addEventListener`

[MDN:](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#The_value_of_this_within_the_handler) *The value of this inside the handler is a reference to the element.*

```javascript
button.addEventListener('click', function() { // 若用()，this會指向global
    // this: button
});
```

* 作為method，需要`this`指向object

```javascript
const james = {
    name: 'James',
    greet: function() { // 若用()，this會指向global
        console.log(`Hello ${this.name}!`);
    }
}
```

* 添加prototype method

```javascript
function Person(name) {
    this.name = name;
}
Person.prototype.greet = function() { // 若用()，this會指向global
    console.log(`Hello ${this.name}`);
}

const james = new Person('James');
james.greet();
```

* 需要使用`arguments`

```javascript
const sayHello = () => {
    const names = Array.from(arguments); // ReferenceError: arguments is not defined
    for (let name of names) {
        console.log(`Hello ${name}!`);
    }
}
sayHello('James', 'Mark');
```

## <a name="default-args"></a>Default Function Arguments
```javascript
function greeting(greet = 'Hello', name = 'my friend', end = '!') {
    console.log(`${greet} ${name}${end}`);
}

greeting(); // Hello my friend!

// 有些arguments有給值
greeting(undefined, 'James', undefined); // Hello James!
```
