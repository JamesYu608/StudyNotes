### MODULE #3
# Template Strings
講者: [wesbos](https://github.com/wesbos) - [ES6 for Everyone](https://es6.io/)

# Outline
* [Template Strings Introduction](#intro)
* [Tagged Template Literals](#tagged)
    * [Additional: `debugger`](#debugger)
* [進階應用](#example)
    * Dictionary
    * 防止惡意輸入


## <a name="intro"></a>Template Strings Introduction
基本用法略過，有一個重要的特性是: **換行字元在template literals中會被保留**

```javascript
// 以下三者相等
const hello = "Hello\nWorld";

const hello2 = "Hello\n" +
"World";

// Template Literals
const hello3 = `Hello
World`;
```

這項特性可以應用在html markup上，讓code變得更清楚易讀，例如:

* Html

```javascript
const markup = `
<div class="person">
  <h2>
    ${person.name}
    <span class="job">${person.job}</span>
  </h2>
</div>
`;
```

* if statement

```javascript
const markup = `
<div class="song">
  <p>
    ${song.featuring ? `(Featuring ${song.featuring})` : ''}
  </p>
</div>
`;
```

* Loop array

```javascript
const markup = `
<ul class="dogs">
  ${dogs.map(dog => `
    <li>
      ${dog.name}
      is
      ${dog.age * 7}
    </li>`).join('')}
</ul>
`;
```

* Render function

```javascript
function renderKeywords(keywords) {
    return `
      <ul>
        ${keywords.map(keyword => `<li>${keyword}</li>`).join('')}
      </ul>
    `;
}
const markup = `
<div class="beer">
  <h2>${beer.name}</h2>
  <p class="brewery">${beer.brewery}</p>
  ${renderKeywords(beer.keywords)}
</div>
`;
```

參考: [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger)

## <a name="tagged"></a>Tagged Template Literals
自行控制template literals回傳的string，在template literals前面加上function name:

```javascript
const james = {
    name: 'James',
    age: 28
};

function myLog(strings, ...value) {
    // strings: ["My name is ", ", I'm ", " years old.]
    // ...value: ["James", 28]
    return // 自行實作
}

console.log(
    myLog`My name is ${james.name}, I'm ${james.age} years old.`
);
```

*__Note:__ `strings`的長度永遠比`...value`多1*

若上面例子改為`` `My name is ${james.name}, I'm ${james.age}` `` (以variable結尾)，則:

* `strings: ["My name is ", ", I'm ", ""]`，length為3，多一個空字串
* `...values: ["James", 28]`，length為2

```javascript
function highlight(strings, ...values) {
    let str = '';
    strings.forEach((string, i) => {
      // 這邊特別用${values[i] || ''}，就是因為strings會比values長度多一，最後一個values[i]會是undefined
      str += `${string} <span contenteditable class="hl">${values[i] || ''}</span>`;
    });
    return str;
}

const sentence = highlight`My dog's name is ${name} and he is ${age} years old`;
```

### <a name="debugger"></a>Additional: `debugger`
在code裡面安插keyword `debugger`，會在該處設中斷點，方便查看當前execution context

## <a name="example"></a>進階應用
### Tagged + Dictionary
```javascript
const dict = {
    HTML: 'Hyper Text Markup Language',
    CSS: 'Cascading Style Sheets',
    JS: 'JavaScript'
};

function addAbbreviations(strings, ...values) {
  if (dict[value]) {
    // ...
  }
  // ...
}

// 這邊${}中雖然是傳primitive string，但目的是為了讓tagged function可以處理
const sentence = addAbbreviations`I love to code ${'JS'}, ${'HTML'} and ${'CSS'} all day and all night long!`
```

### 防止惡意輸入 (html hack)
使用[DOMPurify](https://github.com/cure53/DOMPurify)

```javascript
function sanitize(strings, ...values) {
    const dirty = strings.reduce((prev, next, i) => `${prev}${next}${values[i] || ''}`, '');
    return DOMPurify.sanitize(dirty);
}
const aboutMe = `I love to do evil <img src="http://unsplash.it/100/100?random" onload="alert('you got hacked');" />`;
const html = sanitize`
    <p>${aboutMe}</p>
`;
```

當然也可以直接:

```javascript
const html = DOMPurify.sanitize(`
    <p>${aboutMe}</p>
`);
```
