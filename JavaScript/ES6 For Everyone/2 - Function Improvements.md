### MODULE #2
# Function Improvements: Arrows and Default Arguments
講者: [wesbos](https://github.com/wesbos) - [ES6 for Everyone](https://es6.io/)

# Outline
TODO

## Arrow Functions Introduction
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

## Arrow Functions and `this`
## Default Function Arguments
## When NOT to use an Arrow Function
## Arrow Functions Exercises
