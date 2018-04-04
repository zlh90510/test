const express = require('express');
const bodyParser = require('body-parser');
const mg = require('mongoose');
const mongoose = require('./config/mongoose.js');
const db = mongoose();
var session = require('client-sessions');

var User = mg.model('users');
var app = express();

app.use(session({
    cookieName: 'session',
    secret:'randome_string',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
}));
app.use(function (req, res, next) {
   if(req.session && req.session.user){
       User.findOne({user:req.session.user.user}, function (err, user) {
            if(user){
                req.user = user;
                delete req.user.password;
                req.session.user = user;
            }
            next();
       });
   }else {
       next();
   }
});


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('./public'));

app.get('/',function (req, res) {
    res.end('hello!\n')
});

app.route('/art').get(function (req, res) {
    console.log(req);
    res.send( req.query )
}).post(function (req, res) {
    console.log(req);
    res.send( req.body )
});

app.route('/createUser').post(function (req, res, next) {
    var user = {
        user: req.body.user,
        pw: req.body.password
    };
    User.find({"user":user.user}, function (err, doc) {
        if(err){
            res.end('err');
            return next();
        }
        if(doc.length >= 1){
            const response = {
                success: false,
                msg: "用户名已被使用！"
            };
            res.send(response);
        } else {
            User.create(user, function (err, doc) {
                if(err){
                    res.end('Error');
                    return next();
                }
                const response = {
                    success: true,
                    user: {
                        user: doc.user,
                        password: doc.pw
                    },
                    msg: "注册成功！"
                };
                res.send(response);
            });
        }
    });
});
app.route('/login').post(function (req, res, next) {
    var user = {
        user: req.body.user
    };
    User.find(user,function (err, doc) {
        if(err){
            res.end('err');
            return next();
        }
        if(doc){

            if(doc[0].pw === req.body.password){
                console.log(doc, req.body.password);
                req.session.user = user;
                const response = {
                    success: true,
                    msg: "登陆成功！"
                };
                res.send(response);
            } else {
                const response = {
                    success: false,
                    msg: "Invalid username or password!"
                };
                res.send(response);
            }

        } else {
            const response = {
                success: false,
                msg: "Invalid username or password!"
            };
            res.send(response);
        }
    });
});

app.get('/logout', function (req, res) {
   req.session.reset();
   res.send('user is logout!')
});

function requireLogin (req, res, next) {
    if (!req.user) {
        res.send({msg:'please login first!', success: false});
    } else {
        next();
    }
}
app.get('/loginCheck', requireLogin, function(req, res) {
    res.send({msg:'user is login!', success: true});
});
app.route('/findAllUsers').get(function (req, res, next) {
    User.find({},function (err, doc) {
        if(err){
            res.end('err');
            return next();
        }
        res.send(doc);
    });
});
app.route('/findByName').get(function (req, res, next) {
    User.find({user:req.query.user},function (err, doc) {
        if(err){
            res.end('err');
            return next();
        }
        res.send(doc);
    });
});
app.route('/modify').post(function (req, res, next) {
    console.log(req.body);
    if(req.body.password  && req.body.password != ""){
        User.update({user:req.body.user},{$set:{pw:req.body.password}},{ multi: true },function (err, doc) {
            if(err){
                res.end('err');
                return next();
            }
            const response = {
                success:true,
                msg:'密码修改成功！'
            };
            console.log(doc);
            res.send(response);
        });
    }else {
        const response = {
            success:false,
            msg:'新密码不能为空！'
        };
        res.send(response);
    }
});


app.route('/delete').post(function (req, res, next) {
    console.log(req.body);
    User.remove({user:req.body.user}, function (err) {
        if(err){
            res.end('err');
            return next();
        }
        res.send({success:true});
    })
});

app.listen(18001,function afterListen() {
    console.log('18001 is on running!!')
});