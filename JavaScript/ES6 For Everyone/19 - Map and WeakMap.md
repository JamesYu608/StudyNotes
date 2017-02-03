### MODULE #19
# Map and WeakMap
講者: [wesbos](https://github.com/wesbos) - [ES6 for Everyone](https://es6.io/)

# Outline
* [Maps](#maps)
* [Iterating Maps](#iterating)
* [WeakMaps](#weakmaps)

## <a name="maps"></a>Maps
跟其它語言相比，較特別的是**key可以是任意objects，不一定要是**`string`:

```javascript
const myMap = new Map();
const me = { name: 'James Yu', age: 28 };

// Add
myMap.set('James', me); // Key: string, Value: object
myMap.set(me, 'James'); // Key: object, Value: string

// Access
myMap.get('James'); // { name: 'James Yu', age: 28 }
myMap.get(me); // 'James'
```

### `has` / `delete` / `clear`
```javascript
console.log(myMap.size); // 2

// .has()
myMap.has('James'); // true

// .delete()
myMap.delete('James')
console.log(myMap.size); // 1

// .clear()
myMap.clear();
console.log(myMap.size); // 0
```

## <a name="iterating"></a>Iterating Maps
* `for...of`

```javascript
for (const [key, val] of myMap) {
    console.log(key, val);
}
```

* `.forEach()`

```javascript
myMap.forEach((val, key) => console.log(val, key));
```

### Example: Map Metadata with DOM Node Keys
運用key可以不必是`string`的特性，為button object做click count的紀錄:

```javascript
const clickCounts = new Map();
const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
    clickCounts.set(button, 0);
    button.addEventListener('click', function() {
        const val = clickCounts.get(this);
        clickCounts.set(this, val + 1);
        console.log(clickCounts);
    });
});
```

## <a name="weakmaps"></a>WeakMaps
類似[WeakSets](18 - Set and WeakSet.md#weaksets)，差別在於只有**key的部分不可以是primitives**

Weak reference (GC)，針對的是key:

```javascript
let james = { name: 'James' };
let mark = { name: 'Mark' };

const strong = new Map();
const weak = new WeakMap();

strong.set(james, 'Hello, James!');
weak.set(mark, 'Hello, Mark!');

james = null;
mark = null;

// 過一會，mark自動從weak移除
strong // Map {Object {name: "James"} => "Hello, James!"}
weak // WeakMap {}
```
