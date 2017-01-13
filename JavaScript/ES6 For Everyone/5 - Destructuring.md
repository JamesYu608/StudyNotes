### MODULE #5
# Destructuring
講者: [wesbos](https://github.com/wesbos) - [ES6 for Everyone](https://es6.io/)

# Outline
* [Destructuring Objects](#object)
    * 基本 / Nested / Rename / Default Value
    * [應用:](#object-example) 只取回傳result (object) 的部分properties / 不用照順序的function參數
* [Destructing Arrays](#array)
    * 基本 / Rest (`...`)
    * [應用:](#array-example) Swapping Variables with Destructuring

## <a name="object"></a>Destructuring Objects
```javascript
var james = {
    firstname: 'James',
    lastname: 'Yu',
    phone: '0912-345-678',
    address: {
        country: 'Taiwan',
        city: 'Taipei'
    }
};
```

* 基本

```javascript
const firstname = james.firstname;
const lastname = james.lastname;
// 等同於
const { firstname, lastname } = james;
```

* Nested

```javascript
const country = james.address.country;
const city = james.address.city;
// 等同於
const { country, city } = james.address; // 注意這邊，destructuring不會往下找nested properties
// 若改成
const { country, city } = james; // 找不到，country和city都是undefined
```

* Destructuring + rename

```javascript
const first = james.firstname;
const last = james.lastname;
// 等同於
const { firstname: first, lastname: last } = james;
```

* Default Value

```javascript
const { age = 28, job, firstname, lastname = 'Chen' } = james;

// Result
age: 28 // 沒找到，有設default value
job: undefined // 沒找到，沒給default value
firstname: "James" // 有找到
lastname: "Yu" // 有找到，忽略default value
```

Another Example:

```javascript
const { w: width = 400, height = 500 } = { w: 800 };
// Result
width: 800
height: 500
```

### 注意destructuring object不能是`undefined`或`null`
```javascript
const {a, b} = undefined; // Error
```

### <a name="object-example"></a>應用範例
* 只取回傳result (object) 的部分properties

```javascript
function convertCurrency(amount) {
    const converted = {
      USD: amount * 0.76,
      GPB: amount * 0.53,
      AUD: amount * 1.01,
      MEX: amount * 13.30
    };
    return converted;
}

// 不需要整個回傳的object，也不用在意順序
const { GPB, MEX } = convertCurrency(100);
// Result
GPB: 53
MEX: 1330
```

* 不用照順序的function參數

```javascript
// 給default = {}是為了避免沒有傳參數進來，Error
function tipCalc({ total = 100, tip = 0.15, tax = 0.13 } = {}) {
    return total + (tip * total) + (tax * total);
}

const bill = tipCalc({ tip: 0.20, total: 200 }); // 傳object作為參數
// 呼叫時等同於{ total = 100, tip = 0.15, tax = 0.13 } = { tip: 0.20, total: 200 }
```

## <a name="array"></a>Destructing Arrays
* 基本

```javascript
const james = ['James', 'Yu', 28];
const first = james[0];
const last = james[1];
const age = james[2];
// 等同於
const [first, last, age] = james;
```

```javascript
const james = 'James,Yu,28';
const [first, last, age] = james.split(','); // 這邊age為string "28"
```

* Rest (`...`)

```javascript
const names = ['James', 'Mark', 'Tom', 'Jack', 'Sam'];
const [player1, player2, players] = names;
// Result
player1: "James"
player2: "Mark"
players: "Tom" // 不是我們要的
```

使用rest:

```javascript
const names = ['James', 'Mark', 'Tom', 'Jack', 'Sam'];
const [player1, player2, ...players] = names;
// Result
player1: "James"
player2: "Mark"
players: ["Tom", "Jack", "Sam"]
```

### <a name="array-example"></a>應用範例
* Swapping Variables with Destructuring

```javascript
let player1 = 'James';
let player2 = 'Mark';

[player1, player2] = [player2, player1];
// Result
player1: "Mark"
player2: "James"
```

