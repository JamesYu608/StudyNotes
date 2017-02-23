# Express
from: [Learn and Understand NodeJS](https://www.udemy.com/understand-nodejs/learn/v4/overview)

# Outline
* [Making it Easier to Build a Web Server](#easier)
    * [Additional: Environment Variables](#env)
    * [Handle HTTP Request (GET / POST / ...)](#http)
* [Routes](#routes)
* [Static Files and Middleware](#middleware)
    * [Make my own middleware](#own)
    * [Static Files](#static-file)
    * [3rd-party middleware](#3rd-party)
* [Templates and Template Engines](#template)
* [Querystring and Post Parameters](#parameters)
    * [Querystring](#query)
    * [Post Parameters](#post)
* [Structuring an App](#structuring)

## <a name="easier"></a>Making it Easier to Build a Web Server
Express module將做為web server所常用到的功能**實作、包裝**起來，讓我們更容易使用

它並沒有在NodeJS的C++ part多修改東西，例如看source code:

`express/lib/application.js`:

```javascript
app.listen = function listen() {
    var server = http.createServer(this);
    return server.listen.apply(server, arguments);
};
```

最後還是使用了標準的NodeJS `http` module，讓我們可以像這樣使用:

```javascript
var express = require('express');
var app = express();

app.listen(3000); // create http server的邏輯被express封裝起來
```

### <a name="env"></a>Additional: Environment Variables
*Global variables specific to the environment (server) our code is living in.*

由於不同的server (e.g. dev / release)會有不同的設定，我們在code中預先保留這種彈性

```javascript
var express = require('express');
var app = express();

// process.env是NodeJS的global variable
// PORT是自己訂在env上的變數
var port = process.env.PORT || 3000; // 這邊沒有特別宣告PORT的值的話會跑在3000
app.listen(port);
```

### <a name="http"></a>Handle HTTP Request (`GET` / `POST` / ...)
```javascript
...
// Http Request: GET
app.get('/', function(req, res) {
    // 不需要自己做res.writeHead(200, {'Content-Type': 'text/plain'})之類的工作
    // Express會處理
    res.send(`
    <html>
        <head></head>
        <body><h1>Hello, world!</h1></body>
    </html>`);
});

// Http Request: POST
app.post('/', function(req, res) {
    // Do something different...
});

app.listen(port);
```

#### Response with JSON
上面是回HTML給client，也可以用`res.json`直接將object以JSON的方式傳給client

```javascript
app.get('/api', function(req, res) {
    // Object literal syntax
    res.json({ firstname: 'James', age: 28 });
});
```

## <a name="routes"></a>Routes
Express支援做為web server必備的routing pattern: [Routing API Doc](http://expressjs.com/en/guide/routing.html)

#### Example
```javascript
app.get('/person/:id', function(req, res) {
    res.send(`
    <html>
        <head></head>
        <body><h1>Person: ${req.params.id}</h1></body>
    </html>`);
});

// Testing
Url: http://localhost:3000/person/30
Output: Person: 30
```

## <a name="middleware"></a>Static Files and Middleware
*__Middleware:__ Code that sits between two layers of software.*

對於Express來說，middleware就是從request到response間的中介站

### <a name="own"></a>Make my own middleware
```javascript
// "/": Routing path
app.use('/', function(req, res, next) { // 我們"使用(use)" middleware
    console.log('Request Url: ' + req.url);
    next(); // call the next middleware
});
```

呼叫`next()`來將`req`、`res`傳給下一個符合routing path的middleware

#### 注意
1. middleware在code中的順序很重要，會依序執行
2. 之前的`app.get`、`app.post`等方法也可以視為middleware，只是不會再呼叫`next()`

    例如若middleware在`app.get`之後，則永遠不會執行到

### <a name="static-file"></a>Static Files
*Not processed by code in any way. For example: HTML, CSS and image files are "static" files.*

#### Example: 下載css
Static file (`public/style.css`):

```css
body {
    font-family: Arial, Helvetica, sans-serif;
}
```

`app/js`:

```javascript
// express.static(path): 回傳一個middleware function，讓path下的檔案可以被下載
app.use('/my_assets', express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    res.send(`
    <html>
        <head>
            <link href=my_assets/style.css type=text/css rel=stylesheet />
        </head>
        <body><h1>Hello, world!</h1></body>
    </html>`);
});
```

`Chrome Console -> Network -> style.css -> Header`

可以看到HTML的header: `href=my_assets/style.css`

被middleware導向`http://localhost:3000/my_assets/style.css`

### <a name="3rd-party"></a>3rd-party middleware
參考: [Resource: Middleware](http://expressjs.com/en/resources/middleware.html)

有許多常用、穩定的middleware，例如[passport](https://github.com/jaredhanson/passport)、[cookie-parser](http://expressjs.com/en/resources/middleware/cookie-parser.html)

## <a name="template"></a>Templates and Template Engines
#### Template Engines
和之前自己實作的一樣，template engine是在server side做轉換，到user的時候已經是browser支援的HTML+CSS+JavaScript

[Best Javascript Templating Engines](https://www.slant.co/topics/51/~best-javascript-templating-engines)

[handlebarsjs](http://handlebarsjs.com/)

#### Simple Example
這邊用[EJS](http://ejs.co/)作為例子:

```javascript
app.set('view engine', 'ejs');
```

`views/index.ejs` (預設先找`views/`下的`.ejs`檔案，可改):

```html
<html>
    <head>
        <link href="/my_assets/style.css" type="text/css" rel="stylesheet" />
    </head>
    <body>
        <h1>Hello world!</h1>
    </body>
</html>
```

`app.js`:

```javascript
app.get('/', function(req, res) {
    res.render('index'); // 從本來直接用res.send，改成res.render (透過template engine)
});
```

#### 將parameters傳給template
`views/person.ejs`:

```html
<html>
    <head>
        <link href="/my_assets/style.css" type="text/css" rel="stylesheet" />
    </head>
    <body><h1>Person: <%= ID %></h1></body>
</html>
```

`app.js`:

```javascript
app.get('/person/:id', function(req, res) {
    res.render('person', { ID: req.params.id }); // 可以傳入任何object
});
```

## <a name="parameters"></a>Querystring and Post Parameters
### <a name="query"></a>Querystring
`app.js` (可以直接從`req.query` access):

```javascript
app.get('/person/:id', function(req, res) {
    res.render('person',
        { ID: req.params.id,
          Qstr: req.query.qstr
        });
});
```

`person.ejs`:

```html
<h2>Querystring Value: <%= Qstr %></h2>
```

* Url: `http://localhost:3000/person/30?qstr=123`
* Output: `Querystring Value: 123`

### <a name="post"></a>Post Parameters
`app.js` (這邊使用middleware: [body-parser](http://expressjs.com/en/resources/middleware/body-parser.html)):

```javascript
var bodyParser = require('body-parser');

// create application/x-www-form-urlencoded parser (middleware function)
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// .get或.post可以接受一個callback function，這邊我們給它middleware function
app.post('/person', urlencodedParser, function(req, res) {
    res.send('Thank you!');
    // 根據body-parser的說明:
        // Parse incoming request bodies in a middleware before your handlers,
        // availabe under the req.body property.
    // 使用.body取得post的parameters
    console.log(req.body.firstname);
    console.log(req.body.lastname);
});
```

`index.ejs` (弄一個簡單的post form來測試):

```html
<form method="POST" action="/person">
    First name: <input type="text" id="firstname" name="firstname" /><br />
    Last name: <input type="text" id="lastname" name="lastname" /><br />
    <input type="submit" value="Submit" />
</form>
```

#### Post Parameters with JSON
`app.js`:

```javascript
// create application/json parser (middleware function)
var jsonParser = bodyParser.json();

app.post('/personjson', jsonParser, function(req, res) {
    res.send('Thank you for the JSON data!');
    console.log(req.body.firstname);
    console.log(req.body.lastname);
});
```

`index.ejs` (測試):

```html
...
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
...
<script>
    $.ajax({
        type: "POST",
        url: "/personjson",
        data: JSON.stringify({ firstname: 'James', lastname: 'Yu'}),
        dataType: 'json',
        contentType: 'application/json'
    });
</script>
```

## <a name="structuring"></a>Structuring an App
**沒有所謂最好的方法**

其中一個方式是使用[Express Generator](http://expressjs.com/en/starter/generator.html)來套用範本 (有許多選項可以調整)，產生web server application的基本架構

#### Express Generator
1. Routing的部分使用middleware: `express.Router()`
2. `package.json`的`start` script，讓我們可以使用`npm start`來執行application
