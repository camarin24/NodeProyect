var express = require("express");
var bodyparser = require("body-parser");
var User = require("./models/user").User;
var session = require("express-session");
var router_app = require("./app_route");
var session_middleware = require("./middlewares/session");
var app = express();

//Esto es para openshift
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.set("view engine","jade");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(session({
  secret:"tupapitomk24",
  resave:false,
  saveUninitialized:false
}));


app.get("/",function(req,res){
  console.log(req.session.user_id);
  res.render("index");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/sigup",function(req,res){
  User.find(function(err,doc){
    console.log(doc);
    res.render("sigup");
  })
});
app.post("/session",function(req,res){
  User.findOne({email:req.body.email,password:req.body.password},
    function(err,docs){
      req.session.user_id = docs._id;
      console.log(docs);
      res.redirect("/app");
  });
});
app.post("/users",function(req,res){
  var user = new User({email:req.body.email,
                        password:req.body.password,
                        password_confirmation:req.body.password_confirmation
                      });
  console.log(user.password_confirmation);
  user.save().then(function(){
    res.send("Usuario guardado exitosamente");
  },function(err){
    if(err){
      console.log(err);
      res.send("Error al guardar el usuario");
    }
  })

});


app.use("/app",session_middleware);
app.use("/app",router_app);
app.listen(8080);
