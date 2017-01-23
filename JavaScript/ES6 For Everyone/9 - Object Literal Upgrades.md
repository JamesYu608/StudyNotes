### MODULE #9
# Object Literal Upgrades
講者: [wesbos](https://github.com/wesbos) - [ES6 for Everyone](https://es6.io/)

1. Shorthand property / method names
2. Computed property names

```javascript
const name = 'James';

const james = {
    // Shorthand property names
    name, // 等同於name: name
    
    // Shorthand method names
    sayHello() { // 等同於sayHello: function() {
        console.log(`Hello, ${this.name}!`)
    },
    
    // Computed property names
    [`${name}_age`]: 28 // 等同於James_age: 28
}
```

#### Computed property names應用
```javascript
const keys = ['name', 'city', 'age'];
const values = ['James', 'Taipei', 28];

const james = {
    [keys.shift()]: values.shift(),
    [keys.shift()]: values.shift(),
    [keys.shift()]: values.shift()
}

// {name: "James", city: "Taipei", age: 28}
```
