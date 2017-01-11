### MODULE #1
# New Variables: Creation, Updating and Scoping
講者: [wesbos](https://github.com/wesbos) - [ES6 for Everyone](https://es6.io/)

# Outline
* [`var`, `let`, `const`該選擇何種宣告方式?](#declaration)
* [Scope & `var`/`let` in for Loop](#scope)
* [`Object.freeze(obj)`](#freeze)

## <a name="declaration"></a>`var`, `let`, `const`該選擇何種宣告方式?
JavaScript中有三種宣告方式: `var`, `let`, `const`，在ES6中不要再使用`var`

**一般來說一律先用`const`，若之後發現需要rebinding，再將`const`改成`let`**

## <a name="scope"></a>Scope & `var`/`let` in for Loop
### Scope
`var`的scope為funciton，另外兩個為**block**

### `var`/`let` in for Loop
`var`的case，這邊`i`指向同一個global instance

``` javascript
for (var i = 0; i < 5; i++) {
    setTimeout(function() {
        console.log(`The number is ${i}`);
    }, 1000);
}
console.log(i);

// Output:
5 // i為global
The number is 5
The number is 5
The number is 5
The number is 5
The number is 5
```

想像一下，若for loop中需要跑幾個非同步的requests，或像下面`setTimeout()`的例子

我們沒辦法在for loop已經跑完後去access當時的`i` value，**這個問題可以透過將`var`改成`let`來解決**

``` javascript
for (let i = 0; i < 5; i++) {
    setTimeout(function() {
        console.log(`The number is ${i}`);
    }, 1000);
}
console.log(i);

// Output:
undefined // i不是，也沒有必要為global
The number is 0
The number is 1
The number is 2
The number is 3
The number is 4
```

這是一個比較特殊的case，`i`在每次進入loop block時都重新建立instance，但是會從上一次loop後的value初始化

參考: [stackoverflow](http://stackoverflow.com/questions/16473350/let-keyword-in-the-for-loop)

## <a name="freeze"></a>[`Object.freeze(obj)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
**`const` is not about immutability**

**`const` creates an immutable binding**

也就是說，`const`若指向某object，該object的binding對象不能改，但properties仍然可以被修改

``` javascript
const person = {
    name: 'James',
    age: 28
};

person.age = 29; // 可以改
console.log(person);

// Output:
{ name: 'James', age: 29 }
```

使用`Object.freeze(obj)`來讓`obj`的properties不能被修改

``` javascript
const person = {
    name: 'James',
    age: 28
};

Object.freeze(person);
person.age = 29; // 改了沒用 (strict mode下會丟error)
console.log(person);

// Output:
{ name: 'James', age: 28 } // age仍為28
```

```javascript
const james = Object.freeze(person); // Binding和target都不能修改
```

**注意若frozen object的property也是指向某object，則該object的properties仍然可以修改 (除非也把它frozen)**

``` javascript
const person = {
    name: 'James',
    home: {city: 'Taipei'}
};


const james = Object.freeze(person);
james.home = {country: 'Taiwan'}; // 不能改
james.home.city = 'Tokyo'; // 可以改
console.log(james);

// Output:
{ name: 'James', home: { city: 'Tokyo' } } // city被修改
```

