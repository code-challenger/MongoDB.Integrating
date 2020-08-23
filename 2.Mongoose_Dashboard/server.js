//import required modules
var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var mongoose = require('mongoose')

//setup APP
var app = express()
app.set('view engine', 'ejs')
app.set('views',path.join(__dirname, '/client/views'))
app.use(express.static(__dirname + '/client/static'))
app.use(bodyParser.urlencoded({extended:true}))

////////////////MODELS/////////////////////
mongoose.connect('mongodb://localhost/mongoose_dashboard')
var DogSchema = mongoose.Schema({
  name:{type:String, required:true, minlength:2},
  description:{type:String,required:true, minlength:2}
},{timestamps:true})
mongoose.model('Dog',DogSchema)
//retrieve MODELS
var Dog = mongoose.model('Dog')


///////////////ROUTES////////////////
// GET '/' Displays all of the mongooses.
app.get('/', function(req,res){
  Dog.find({},function(err, results){
    if (err) {
      res.json(err)
    }else{
      res.render('index', {dogs:results})
    }
  })
})
// GET '/mongooses/new' Displays a form for making a new mongoose.
app.get('/mongooses/new', function(req,res){
  res.render('new')
})
// GET '/mongooses/:id' Displays information about one mongoose.
app.get('/mongooses/:id', function(req,res){
  Dog.findOne({_id:req.params.id}, function(err,results){
    if (err) {
      res.json(err)
    }else{
      // console.log (results.name)
      res.render('animal',{dog:results})
    }
  })
})

// POST '/mongooses' Should be the action attribute for the form in the above route (GET '/mongooses/new').
app.post('/mongooses', function(req,res){
  var dog = new Dog(req.body)
  dog.save(function(err){
    if (err) {
      res.json(err)
    }else{
      res.redirect('/')
    }
  })
})
// GET '/mongooses/:id/edit' Should show a form to edit an existing mongoose.
app.get('/mongooses/:id/edit', function(req,res){
  Dog.findOne({_id:req.params.id}, function(err,results){
    // console.log(results)
    if (err) {
      res.json(err)
    }else{
      res.render('edit',{dog:results})
    }
  })
})
// POST '/mongooses/:id' Should be the action attribute for the form in the above route (GET '/mongooses/:id/edit').
app.post('/mongooses/:id',function(req,res){
  Dog.update({_id:req.params.id}, {name:req.body.name, description:req.body.description}, function(err){
    if (err) {
      res.json(err)
    }else{
      res.redirect('/')
    }
})})

// POST '/mongooses/:id/destroy' Should delete the mongoose from the database by ID.
app.post('/mongooses/:id/destroy',function(req,res){
  console.log(req.params)
  console.log('here',Dog.find({_id:req.params.id}))

  Dog.remove({_id:req.params.id},function(err){
    if (err) {
      res.json(err)
    }else{
      res.redirect('/')
    }

  })
})

///////////web server/////////
app.listen(8888, function(){
  console.log('8888');
})
