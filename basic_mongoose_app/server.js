//require the express module
var express = require('express');
// create an express app
var app = express();
//require mongoose
var mongoose = require('mongoose');
// connect to mongodb database using mongoose "basic_mongoose" is our database name'

//require the body-parser (to recieve the post data)
var bodyParser = require('body-parser');
//integrate bodyParser with our app
app.use(bodyParser.urlencoded({extended:true}));
//require path
var path = require('path');
//setting our static folder directory
app.use(express.static(__dirname + "/static"));
//setting our Views folder directory
app.set('views', __dirname + '/views');
//setting our view engine set to EJS
app.set('view engine', 'ejs')
mongoose.connect('mongodb://localhost/basic_mongoose');
var UserSchema = new mongoose.Schema({
  name:{type:String},
  age:{type:Number}
},{timestamps:true})
mongoose.model('User',UserSchema);//we are setting this schema in our models as 'User'
var User = mongoose.model('User');//we are retrieving this schema from our models named "User"
//ROUTES
//ROOT REQUEST
// The root route -- we want to get all of the users from the database and then render the index view passing it all of the users
app.get('/',function(req, res){
  User.find({}, function(err,users){
    if (err) {
      res.json(err)

    }
    else{
      // console.log(users);
      res.render('index',{users:users});
    }
  })


})
//add user request
app.post('/users',function(req,res){
  console.log("POST DATA", req.body);

  //creat a new user with the name and age from the req.bodyParser
  var user = new User({name:req.body.name,age:req.body.age});
  //try to save
  user.save(function(err){
    if(err){
      console.log("something went wrong");
    } else{
      console.log("successfully added user");
      res.redirect('/');
    }
  })
})
app.listen(8000,function(){
  console.log("listening on port 8000");
})
