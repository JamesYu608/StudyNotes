# Object-Oriented Javascript and Prototypal Inheritance
from [JavaScript: Understanding the Weird Parts](https://www.udemy.com/understand-JavaScript/learn/v4/overview)

## Outline
* [Understanding the Prototype](#prototype)
* [Reflection and Extend](#reflection)

## <a name="prototype"></a>Understanding the Prototype
**JavaScript的inheritance很單純、彈性，不用想太複雜**

簡單來說，所有的object都有`__proto__`這個"property"，"reference"到另一個object

當我們在object上呼叫某個properties或methods的時候

如果object本身找不到，就會找`__proto__`的object有沒有

若也沒有，就再找`__proto__`的object的`__proto__`，以此類推

### Prototype Chain
`__proto__`就是prototype的意思，這一連串的reference (inheritance)就是prototype chain

*__vs Scope Chain:__ Prototype Chain是在object中找properties，而Scope Chain是在execution context以及outer environment中找variables*

#### Example
這邊只是簡單示範`__proto__`的運作方式

**實際上我們在建立繼承體系的時候不會，也不應該使用`obj1.__proto__ = obj2`的方式去實作 (有底層的效能問題)**

且會牽扯到function在當作constructor使用的時候，`prototype` (不是`__proto__`)這個property 的作用，之後會再探討

```javascript
var person = {
    firstname: 'Default',
    lastname: 'Default',
    getFullName: function() {
        return this.firstname + ' ' + this.lastname;
    }
}

var james = {
    firstname: 'James',
    lastname: 'Yu'
}
var jane = {
    firstname: 'Jane'
}

// 只是示範，實作上不應該這樣用 (所以設計上，前後有加雙底線避免誤用)
james.__proto__ = person;
jane.__proto__ = james;

console.log(james.getFullName()); // James Yu
console.log(jane.getFullName()); // Jane Yu
```

<img src="./res/Ch04/Prototype Chain.jpeg" width="600">

#### `hasOwnProperty`
判斷properties是否為"該object本身"持有

以上面的例子而言:

```javascript
for (var prop in james) {
    console.log(`${prop}: ${james[prop]}`);
}

// Output
firstname: James
lastname: Yu
getFullName: function () {...}
```

```javascript
for (var prop in james) {
    if (james.hasOwnProperty(prop)) {
        console.log(`${prop}: ${james[prop]}`);
    }
}

// Output
firstname: James
lastname: Yu
```

## <a name="reflection"></a>Reflection and Extend
Underscore有提供一個方法叫做[`extend`](http://underscorejs.org/#extend)

是利用reflection的方法，來將source objects的所有properties，copy到destination object


*__[Reflection](http://www.ithome.com.tw/node/57227):__ An object can look at itself, listing and changing its properties and methods.*

Example:

```javascript
_.extend({name: 'moe'}, {age: 50});
=> {name: 'moe', age: 50}
```

拆解source code:

```javascript
var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length; // 總共傳入幾個objects
      if (length < 2 || obj == null) return obj; // 如果只有一個，直接return該object
      
      for (var index = 1; index < length; index++) { // Loop第一個以外的objects
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length; // 取出所有的keys
        for (var i = 0; i < l; i++) { // Loop所有的keys
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key]; // 若object沒有該key，設起來
        }
      }
      return obj; // 回傳object
    };
};
```

* 這邊[void 0](#http://stackoverflow.com/questions/7452341/what-does-void-0-mean)就是`undefined`
* 在ES6中有內建`extend`的實作，只有名字相同，容易混淆...
