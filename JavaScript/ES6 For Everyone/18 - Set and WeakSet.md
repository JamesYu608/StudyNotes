### MODULE #18
# Set and WeakSet
講者: [wesbos](https://github.com/wesbos) - [ES6 for Everyone](https://es6.io/)

# Outline
* [Sets](#sets)
* [Iterating Sets](#iterating)
* [WeakSets](#weaksets)

## <a name="sets"></a>Sets
### Init
```javascript
const people = new Set();
people.add('James');
people.add('Mark');
people.add('Tom');

// 等同
const people = new Set(['James', 'Mark', 'Tom']); // From Iterable object

// Size
console.log(people.size); // 3
```
### `has` / `delete` / `clear`
```javascript
// .has()
people.has('James'); // true

// .delete()
people.delete('James');
people.has('James'); // false

// .clear()
people.clear();
console.log(people.size); // 0
```

## <a name="iterating"></a>Iterating Sets
**建議:** 直接在set object上使用`for...of`即可

```javascript
for (const person of people) {
    console.log(person);
}
```

以下方法相同:

```javascript
// .forEach(callback)
people.forEach((person => console.log(person)));

// .keys()
for (const person of people.keys()) {
    console.log(person);
}

// .values()
for (const person of people.values()) {
    console.log(person);
}

// . entries()
// people.entries(): SetIterator {["James", "James"], ["Mark", "Mark"], ["Tom", "Tom"]}
for (const [key, value] of people.entries()) {
    console.log(key); // key和value相同
}
```

## <a name="weaksets"></a>WeakSets
```javascript
const ws = new WeakSet();
```

* 只能`add` **objects** (不可以是primitives):

    ```javascript
    ws.add('James'); // Error: Invalid value used in weak set
    ```

* 不會keep objects的reference，當該object已經沒有任何reference，會從set中被移除 (可以被正常GC)

    Example 1:
    
    ```javascript
    // 匿名object，除了WeakSet沒有任何reference
    ws.add({test: 123}); // WeakSet {Object {test: 123}}
    // 過一會，自動從set移除
    ws // WeakSet {}
    ```
    
    Example 2:
    
    ```javascript
    let a = {test: 123};
    ws.add(a); // WeakSet {Object {test: 123}}
    
    // 將a的reference清掉
    a = null;
    // 過一會，自動從set移除
    ws // WeakSet {}
    ```

* 不能iterating / 沒有`clear`

    ```javascript
    for (const value of ws) { // Error: ws[Symbol.iterator] is not a function
        console.log(value);
    }
    
    ws.clear(); // Error: ws.clear is not a function
    ```
