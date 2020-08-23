//import required modules
var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var mongoose = require('mongoose')


//setup App
var app = express()
app.set('view engine','ejs')
app.set('views',path.join(__dirname, '/client/views'))
app.use(express.static(__dirname +'/client/static'))
app.use(bodyParser.urlencoded({extended:true }))


//MODELS
mongoose.connect('mongodb://localhost/quoting_dojo')
var QuoteSchema = mongoose.Schema({
  name:{type:String, required:true, minlength:2},
  quote:{type:String, required:true, minlength:2},
},{timestamps:true})
mongoose.model('Quote', QuoteSchema)

//retrieve the MODELS
var Quote = mongoose.model('Quote')

//ROUTES

app.get('/', function(req,res){


  res.render('index')
})
app.post('/add_quote', function(req,res){
  var message = new Quote(req.body)
  console.log(message);
  message.save(function(err){
    if (err) {
      res.json(err)
    }else{
      res.redirect('/quotes')
    }
  })
})
app.get('/quotes', function(req,res){



  Quote.find({}).sort({createdAt: 'desc'}).exec(function(err, quotes){
    if (err) {
      res.json(err)
    }else{
      // console.log(quotes);

      res.render('quotes', {quotes:quotes})
    }

  });
})


//WEB SERVER
app.listen(8000,function(){
  console.log('8000');
})
