;(function(global, $) { // ;防止其它lib沒有正確的使用";"結尾
    
    // 不使用關鍵字new來建立object
    var Greetr = function(firstName, lastName, language) {
        return new Greetr.init(firstName, lastName, language);   
    }
    
    // 僅在IIFE內使用的變數
    var supportedLangs = ['en', 'es'];
    
    var greetings = {
        en: 'Hello',
        es: 'Hola'
    };
    
    var formalGreetings = {
        en: 'Greetings',
        es: 'Saludos'
    };
    
    var logMessages = {
        en: 'Logged in',
        es: 'Inició sesión'
    };
    
    // public的方法都放在這裡
    Greetr.prototype = {
        
        fullName: function() {
            return this.firstName + ' ' + this.lastName;   
        },
        
        validate: function() {
            if (supportedLangs.indexOf(this.language)  === -1) {
                throw "Invalid language";   
            }
        },
        
        greeting: function() {
            return greetings[this.language] + ' ' + this.firstName + '!';
        },
        
        formalGreeting: function() {
            return formalGreetings[this.language] + ', ' + this.fullName();  
        },
        
        greet: function(formal) {
            var msg;
            
            if (formal) {
                msg = this.formalGreeting();  
            }
            else {
                msg = this.greeting();  
            }

            if (console) {
                console.log(msg);
            }

            return this; // Method Chaining
        },
        
        log: function() {
            if (console) {
                console.log(logMessages[this.language] + ': ' + this.fullName()); 
            }
            
            return this;
        },
                            
        setLang: function(lang) {
            this.language = lang;
            this.validate();
            
            return this;
        },
        
        HTMLGreeting: function(selector, formal) { // 使用jQuery
            if (!$) {
                throw 'jQuery not loaded';   
            }
            
            if (!selector) {
                throw 'Missing jQuery selector';   
            }
            
            var msg;
            if (formal) {
                msg = this.formalGreeting();   
            }
            else {
                msg = this.greeting();   
            }
            
            $(selector).html(msg);
            
            // make chainable
            return this;
        }
        
    };
    
    Greetr.init = function(firstName, lastName, language) { // 真正的constructor function
        
        var self = this;
        self.firstName = firstName || '';
        self.lastName = lastName || '';
        self.language = language || 'en';
        
        self.validate();
        
    }
    Greetr.init.prototype = Greetr.prototype; // 繼承上面的public方法
    
    global.Greetr = global.G$ = Greetr; // Attach到global
}(window, jQuery));