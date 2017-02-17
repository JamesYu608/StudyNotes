#### Prior Knowledge
[JavaScript: Understanding the Weird Parts](/JavaScript/Understanding the Weird Parts/)

# Outline
[Learn and Understand NodeJS](https://www.udemy.com/understand-nodejs/learn/v4/overview)

1. [V8: The JavaScript Engine](1 - V8_The Javascript Engine.md)
    - 從JavaScript到Machine Language
    - JavaScript Engines and The ECMAScript Specification
    - V8 Under the Hood
        - Adding Features to JavaScript
2. [The Node Core](2 - The Node Core.md)
    - What Does Javascript Need to Manage a Server? (**Server Checklist**)
    - NodeJS要如何做到?
    - Version and History
3. [Modules, Exports, and Require](3 - Modules_Exports_Require.md)
    - **Server Checklist: 有良好的方法組織、管理code，讓它們可以容易被維護和重複利用**
    - Let's Build a Module
    - How Do Node Modules Really Work?: module.exports and require
        - 用圖來說明
        - index.*
        - require(*.json)
    - Module Patterns
        - 取代module.exports
            - Module._cache
            - Revealing Module Pattern
        - 增加properties到module.exports
    - exports vs module.exports
    - Requiring Native (Core) Modules
4. [Events and the Event Emitter](4 - Events and the Event Emitter.md)
    - Conceptual Aside: Events
    - Event Emitter (自己實作)
    - The Node Event Emitter (用native core module)
        - Magic String
    - Inheriting From the Event Emitter (util.inherits)
        - Pattern: Parent.call(this)
    - Inheriting From the Event Emitter (class)
    - Export Your Event Emitter
5. [Asynchronous Code, libuv, The Event Loop, Streams, Files, and more…](5 - Asynchronous Code.md)
    - **Server Checklist: 處理檔案 (以及stream)**
    - libuv, The Event Loop, and Non-Blocking Asynchronous Execution
        - Javascript is Synchronous
        - Event Loop
    - Conceptual Aside: Streams and Buffers
    - Conceptual Aside: Binary Data, Character Sets, and Encodings
    - Buffers
        - ES6 Typed Arrays
    - Files and fs
    - Streams
    - Conceptual Aside: Pipes
    - Pipes
        - Chaining
6. HTTP and being a Web Server
7. NPM: the Node Package Manager
8. Express
9. Javascript, JSON, and Databases
10. The MEAN stack
11. Let's Build an App! (in record time)
