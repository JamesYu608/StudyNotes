### MODULE #17
# Proxies
講者: [wesbos](https://github.com/wesbos) - [ES6 for Everyone](https://es6.io/)

# Outline
* [What are Proxies?](#intro)
* [Using Proxies to combat silly errors](#combat)

## <a name="intro"></a>What are Proxies?
將target object用`Proxy` object包裝(wrap)起來，目的是為了自訂此object的各種操作 (e.g. `get`、`set`、`apply`)

1. 在`Proxy` object上操作`set`，**會影響到target object** (`Proxy`是wrapper，不是copy)
2. 可以自訂的操作(稱為trap)，參考[doc](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#Methods)

#### Example 1
```javascript
const james = { name: 'James', age: 28};
const jamesProxy = new Proxy(james, {
    get(target, name) { // getter: string轉大寫
        if (typeof target[name] === 'string') {
            return target[name].toUpperCase();
        }
    },
    set(target, name, value) {
        if (typeof value === 'string') { // setter: string去空白
            target[name] = value.trim();
        }
    }
});

james // {name: "James", age: 28}
// Getter
james.name // "James"
jamesProxy.name // "JAMES"，轉大寫

// Setter
jamesProxy.name = '    James Yu    ' // 去空格
jamesProxy.name // "JAMES YU"

// 會影響target
james // {name: "James Yu", age: 28}
```

#### Example 2 (target可以是empty object)
```javascript
const phoneHandler = {
    set(target, name, value) {
        target[name] = value.match(/[0-9]/g).join('');
    },
    get(target, name) {
        return target[name].replace(/(\d{3})(\d{3})(\d{4})/, '($1)-$2-$3');
    }
};

const phoneNumbers = new Proxy({}, phoneHandler);

phoneNumbers.work = '1234567890'
phoneNumbers.work // "(123)-456-7890"
```

## <a name="combat"></a>Using Proxies to combat silly errors
避免這種情況:

```javascript
const james = {
    name: 'James',
    Name: 'James Yu'
}

james // { name: 'James', Name: 'James Yu' }
```

#### Example
```javascript
const safeHandler = {
    set(target, name, value) {
        // 檢查該key name是否存在target object (都先轉成小寫再比較)
        const likeKey = Object.keys(target).find(k => k.toLowerCase() === name.toLowerCase());
        // 已經存在，丟error
        if (!(name in target) && likeKey) {
            throw new Error(`Oops! Looks like like we already have a(n) ${name} property but with the case of ${likeKey}.`);
        }
        // 預設實作
        target[name] = value;
    }
};

const saftey = new Proxy({ id: 100 }, safeHandler);

saftey.ID = 200; // Error
```
