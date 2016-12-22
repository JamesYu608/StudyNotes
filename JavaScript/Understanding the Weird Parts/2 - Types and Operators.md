# Types and Operators
from [JavaScript: Understanding the Weird Parts](https://www.udemy.com/understand-JavaScript/learn/v4/overview)

## Outline
* [Primitive Types](#primitive)
* [Operators](#operators)
    * [Operator Precedence and Associativity](#precedence-associativity)
    * [Coercion](#coercion)
    * [Comparison Operators](#comparison)
* [Existence and Booleans](#existence-boolean)
    * [Default Values](#default)

## <a name="primitive"></a>Primitive Types
*__A type of data that represents a single value.__* (也就是說，不是object)

在JavaScript中有6種primitive types:

1. `undefined`
2. `null`
3. Boolean: `true` / `false`
4. Number (不像其它語言，數字只有Number這一種type，它是**floating point number**，用來表示整數、小數)
5. String
6. Symbol (ES6，這邊先略過)

# <a name="operators"></a>Operators
*__A special function that is syntactically (written) differently.__*

重點: Operator是特殊的**function**，由JavaScript engine事先定義好方便我們使用

```javascript
var a = 3 + 4; // 7
```

可以想成:

```javascript
var a = 3 + 4;

function +(a, b) {
    return // add the two numbers
}
```

Prefix / Infix / Postfix

```javascript
+(3, 4); // Prefix
3 + 4; // Infix, JavaScript處理"+"的方式
(3, 4)+; // Postfix
```

## <a name="precedence-associativity"></a>Operator Precedence and Associativity
參考: [Operator Precedence and Associativity Table](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)

* Precedence: 決定哪個operator function會先被呼叫，precedence高的優先
    
* Associativity: 當precedence都一樣的時候，operator function呼叫的順序 (左->右 / 右->左)
    
考慮`a = 3 + 4 * 5`這個例子，總共出現了下列三種operators:

* Addition (`+`)
    * Precedence: 13
    * Associativity: left-to-right	
* Multiplication (`*`)
    * Precedence: 14
    * Associativity: left-to-right
* Assignment (`=`)
    * Precedence: 3
    * Associativity: right-to-left

因此`a = 3 + 4 * 5`的執行過程:


1. `*`的precedence最大: `a = 3 + 20`
2. `+`比`=`大: `a = 23`

**關於assignment: `a = b`**

`a = b`: 將右邊設給左邊後，**return 右邊**

```javascript
var a = 2, b = 3, c = 4;
a = b = c; // right-to-left
```

結果`a`, `b`, `c`全部為4，過程:

1. `b = c`，兩者現在皆為4，然後return 4
2. `a = 4`

**Grouping: `(...)`有最高的precedence**

## <a name="coercion"></a>Coercion
*__Converting a value from one type to another.__*

由於JavaScript是dynamically typed，所以這經常發生

```javascript
var a = 1 + '2'; // 12
```
Number `1`被自動轉換成String `'1'`

如先前所提，operator只是特殊的function，而coercion是這個function的一部分

## <a name="comparison"></a>Comparison Operators

考慮這個例子，`1 < 2 < 3`，結果為true沒問題，但`3 < 2 < 1`結果也為true，為什麼?

答案是因為`3 < 2 < 1`中，`3 < 2`會先做 (`<`為left-to-right)

return false後做`false < 3`，false要怎麼跟3來做比較? **Coerce成Number再比**

```javascript
// 這邊為了展示Number Coercion後的結果，使用Number()，不然的話不建議用這種方式來create number
Number(false) // 0
Number(true) // 1
```

所以`false < 3`會變成`0 < 3`，return true，這就是為何`3 < 2 < 1`會是true

而`1 < 2 < 3`結果為true，只是因為`true < 3`變成`1 < 3`，結果剛好為true罷了

### 這兩個例子顯示coercion雖然非常powerful，但是有可能超出預期的結果，要小心
**尤其是要做相等、不相等的比較的時候**，`==`和`!=`都會先做必要的coercion然後再比較，可能導致許多混亂

參考: [Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)的Sameness Comparisons

**Tip: 在99%的情況下，使用`===`和`!==`來做比較的判斷 (不會coercion，若type不一樣就直接return false)**

只有在很確定在比較的時候，需要coercion才用`==`和`!=`

## <a name="existence-boolean"></a>Existence and Booleans
表示"不存在"一般來說有三種方式:

1. `undefined`
2. `null`
3. `""`

若以`Boolean()`將它們作轉換，結果都為false

常常在`if`中會需要判斷是否存在:

```javascript
if (a) { // 以上三種以外的情況
    console.log('Something is there.');
}
```

**注意0的case**，`Boolean(0)`為`false`

```javascript
if (a || a === 0) { // 若有可能發生a為0，加入判斷，以免被當成沒有值
    console.log('Something is there.');
}
```

## <a name="default"></a>Default Values
**OR operator: `a || b`會依序將`a`和`b` (若有必要)，轉換成Boolean**

1. 若`a`轉換後為true，直接return `a`，否則要再判斷`b`
2. 若`b`轉換後為true，return `b`
3. **若兩者結果都為false，return `b`**

```javascript
"" || 'James' // "James" (""為false，'James'為true)

undefined || "" // ""  (兩者都為false)
"" || undefined // undefined (兩者都為false)
```

因此在ES6前想要設function arguments的default value的話，可以用此特性寫出簡潔的code:

```javascript
function greet(name) {
    name = name || 'James';
    console.log('Hello ' + name);
}

greet(); // Hello James
```

同樣要小心0的case，`greet(0)`會是`Hello James`

ES6以後:

```javascript
function greet(name = 'James') {
    console.log('Hello ' + name);
}

greet(); // Hello James
```

這邊只有`undefined`會使用default value，像`null`或`""`會變成`Hello null`, `Hello`

### Framework Aside
若我程式的架構如:

```javascript
// lib1.js
var libraryName = 'Lib 1';
```

```javascript
// lib2.js
var libraryName = 'Lib 2'; // 同樣的variable name
```

```javascript
// app.js
console.log(libraryName);
```

```html
// index.html
<html>
    <head></head>
    <body>
        <script src="lib1.js"></script>
        <script src="lib2.js"></script>
        <script src="app.js"></script>
    </body>
</html>
```

結果為"Lib 2"，這是因為`index.html`並不是將各個`.js`分別建立execution context來執行，而是照順序執行，所以

1. `libraryName: 'Lib 1'`先被attach到`Global object`
2. 值被改成`'Lib 2'`
3. 最後在console輸出`'Lib 2'`

若順序變成:

```html
<script src="app.js"></script>
<script src="lib1.js"></script>
<script src="lib2.js"></script>
```

那麼一開始就先執行`console.log(libraryName)`，丟出ReferenceError: libraryName is not defined

**在有些libraries中，我們會看到類似下段code，就是為了避免像這樣的碰撞:**

```javascript
// lib2.js
// 檢查Global object - window，看看此variable name是否已經存在
window.libraryName = window.libraryName || 'Lib 2';
```
