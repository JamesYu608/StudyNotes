### MODULE #10
# Promises
講者: [wesbos](https://github.com/wesbos) - [ES6 for Everyone](https://es6.io/)

# Outline
* [Promises Introduction](#intro)
    * [Promise Object](#promise-object)
    * [許多asynchronous的built-in API都是回傳promise object](#built-in)
* [Chaining Promises + Flow Control](#chaining)
    * [`.then`和`.catch`的預設return](#default-return)
* [Working with Multiple Promises](#multiple)

## <a name="intro"></a>Promises Introduction
目的是為了解決JavaScript的callback hell

Promise object可以想成是一個asynchronous task:

```javascript
const students = [
    { name: 'James', score: 90 },
    { name: 'Mark', score: 60 }
];

console.log('New a promise');
new Promise((resolve, reject) => {
    console.log('Running...');
    setTimeout(() => { // 這邊用setTimeout來模擬抓取網路上的students data，需要兩秒
        resolve(students); // 抓到data，呼叫resolve並傳入data
    }, 2000);
}).then(result => console.log(result));

console.log('Do something else...');

// Output:
"New a promise"
"Running..."
"Do something else..."
兩秒後...
[ { name: 'James', score: 90 }, { name: 'Mark', score: 60 } ]
```


### <a name="promise-object"></a>Promise Object
1. 在`new`的時候，需要給一個function，表示要做的asynchronous task

    這個function會帶有兩個參數`(resolve, reject)`，當task:
    
    * 正確執行完畢，呼叫`resolve(result)`，一般會傳入得到的結果 (也可不傳)
    * 反之，呼叫`reject(error)`，一般會傳入錯誤的原因 (也可不傳)
    
2. Promise的`[[PromiseStatus]]` property，用來保存task的狀態，總共有三種:
    1. `"pending"`: 剛`new`出來的初始狀態
    2. `"resolved"`: 呼叫過`resolve`
    3. `"rejected"`: 呼叫過`reject`

3. Promise的`[[PromiseValue]]` property，用來保存task的result value，預設為`undefined`
    
    若呼叫過`resolve`或`reject`，並傳入result，這個value就會被改變
    
4. `.then()`可以取得狀態為`"resolved"`的promise的value

    (同樣地，`.catch()`可以取得狀態為`"rejected"`的promise的value)
    
5. **Promise並沒有使用multi-thread，所有function中的code都是在main thread上執行**

    以上面例子而言，`console.log('Running...');`是在main thread
    
    `setTimeout(...)`也是在main thread呼叫，在browser註冊callback後return
    
    若我們在function中寫`for(;;)`，則new完promise就會卡住，並不會跑`console.log('Do something else...');`
    
#### 分析上面的例子
1. Promise object被`new`出來

    Promise狀態為`"pending"`，值為`undefined`
    
    **function開始執行** (並不是等到execution stack清空後才執行)

    所以會看到`"Running..."`在`"Do something else..."`之前
    
    向browser註冊`setTimeout(...)`後function結束
        
    

2. 繼續執行，印出`"Do something else..."`
3. 兩秒後browser trigger `setTimeout`的callback，`resolve(students)`被呼叫
    
    Promise狀態為`"resolved"`，值為`students`
    
4. 由`.then(result => console.log(result));`印出`students` 

*__Note:__ `.then`和`.catch`不一定要要馬上接在promise object後*

隨時都可以，只要當promise的狀態為`"resolved"`或`"rejected"`，就會呼叫`.then`或`.catch`

```javascript
const fetchData = new Promise((resolve, reject) => {
    console.log('Running...');
    setTimeout(() => { // 這邊用setTimeout來模擬抓取網路上的students data，需要兩秒
        resolve(students); // 抓到data，呼叫resolve並傳入data
    }, 2000);
});

// 之後在某處，不管fetchData做完沒有
fetchData.then(result => console.log(result)); // 也可以
```

### <a name="built-in"></a>許多asynchronous的built-in API都是回傳promise object
上面我們是自己實作promise object，而像是`fetch()`等執行asynchronous task的built-in API，呼叫時回傳的就是promise:

```javascript
const fetchData = fetch('https://jsonplaceholder.typicode.com/posts/1'); // fetchData是promise
fetchData
    .then(data => console.log(data)) // 成功，這邊接到的data是Response object
    .catch((err) => { // 失敗
        console.error(err);
    });
```

## <a name="chaining"></a>Chaining Promises + Flow Control
上面的例子是做單一的asynchronous task，只是這樣的話看不出promise的好處

Promise的目的是為了解決callback hell，所以多個promise可以**chaining** (依序執行、錯誤處理)

### Example:
#### Data
```javascript
const students = [
    { id: 1, name: 'James', class: 'Class A' },
    { id: 2, name: 'Mark', class: 'Class B' }
];

const scores = [
    { name: 'James', score: 90 },
    { name: 'Mark', score: 60 }
];
```

#### Promise
```javascript
function getStudentById(id) {
    return new Promise((resolve, reject) => { // 直到呼叫getStudentById()才會真的開始做
        setTimeout(() => {
            const student = students.find(student => student.id === id);
            if (student) {
                resolve(student);
            } else {
                reject('No student was found!');
            }
        }, 500);
    });
}

function getScoreByName(student) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const score = scores.find(score => score.name === student.name);
            if (score) {
                resolve(score);
            } else {
                reject('Can not find the student!');
            }
        }, 1000);
    });
}
```

#### Chaining
```javascript
getStudentById(2)
    .then(student => {
        return getScoreByName(student);
    })
    .then(score => {
        console.log(score); // {name: "Mark", score: 60}
    })
    .catch(err => {
        console.error(err);
    }); // 若想要，還可以再.then或.catch
```

可以這樣做的原因是`.then`和`.catch`，**回傳的是promise**，所以後面可以再接`.then`或`.catch`

### <a name="default-return"></a>`.then`和`.catch`的預設`return`
#### Case 1 (明確宣告`return new Promise(...)`)
```javascript
p.then(result => {
    // do something...
    return new Promise(...); // 沒問題
});
```

#### Case 2 (明確宣告`return value`)
```javascript
p.then(result => {
    // do something...
    return "Hello, world!"; // 等同於return Promise.resolve("Hello, world!")
});
```

#### Case 3 (沒有明確宣告`return`)
```javascript
p.then(result => {
    // do something...
    // 等同於return Promise.resolve(undefined)
});
```

*__Note:__ `Promise.resolve(value)`和`Promise.reject(reason)`這兩個方法，可以快速取得一個promise object*

*狀態分別為`"resolved"`和`"rejected"`*

## <a name="multiple"></a>Working with Multiple Promises
有時候我們要執行多個asynchronous tasks (promises)，但是它們彼此間**沒什麼相依關係** (不需要chaining，可以同時)

而我們又想在這些tasks**全部做完**的時候一起處理results

可以使用`Promise.all([promise1, promise2, ...])`:

```javascript
const fetchData1 = fetch('https://jsonplaceholder.typicode.com/posts/1');
const fetchData2 = fetch('https://jsonplaceholder.typicode.com/posts/2');

Promise
    .all([fetchData1, fetchData2]) // 用Array的方式傳promises
    .then(responses => { // 等全部promises做完才會跑，responses也會是Array: [response1, response2]
        // 視個人實作，這邊可以再將responses放到Promise.all做chaining
        return Promise.all(responses.map(res => res.json()))
    })
    .then(responses => {
        console.log(responses);
    });
```
