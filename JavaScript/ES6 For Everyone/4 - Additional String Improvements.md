### MODULE #4
# Additional String Improvements
講者: [wesbos](https://github.com/wesbos) - [ES6 for Everyone](https://es6.io/)

# New String Methods
```javascript
const myNumber = '0912-345-678';
```

**Note:** `.startsWith()`, `.endsWith()`, `.includes()`皆為**case sensitivity**，且傳入的argument會被coerce成`string`

### `.startsWith()`
```javascript
myNumber.startsWith('09') // true

// 從指定index開始比較
myNumber.startsWith('345', 5) //true
```

### `.endsWith()`
```javascript
myNumber.endsWith('678') //true

// 取前面n個字元做比較
myNumber.endsWith('345', 8) //true
```

### `.includes()`
```javascript
myNumber.includes('12') // true
```

### `.repeat()`
```javascript
"Hello!".repeat(2) // "Hello!Hello!"
```

較複雜的應用 (靠右對齊):

```javascript
function leftPad(str, length = 20) {
    return `${' '.repeat(length - str.length)}${str}`;
}

leftPad('Hello')
"               Hello"
leftPad('Hi')
"                  Hi"
```
