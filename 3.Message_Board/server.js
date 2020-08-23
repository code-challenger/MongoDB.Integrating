//use express
var express = require('express');
var app = express()
//other dependencies
var bodyParser =  require('body-parser')
//multi comps can user you directory names
var path = require('path')


//// APP Configure ////
//sets up eah file we rendier to ahave the .ejs ext
app.set('view engine', 'ejs')
//where are our views at? in the folder called client
app.set('views',path.join(__dirname, '/client/views'))
//set up some static content for the user
app.use(express.static(__dirname + '/client'))
//user body parser to extract
app.use(bodyParser.urlencoded({extended:true}))


/////Models///////////////

//configure and setup mongoose
var mongoose = require('mongoose')
//connnect to our mongodb
mongoose.connect('mongodb://localhost/my_messageBoard')
//setup our schemas
var MessageSchema = mongoose.Schema({
  name: {type:String,required: true, minlength:2},
  message: {type:String, required: true, minlength:2, maxlength:255},
  _comments:[{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}]
},{timestamps:true});
//register our schema
mongoose.model('Message', MessageSchema)

var CommentSchema = mongoose.Schema({
  name: {type:String,required:true, minlength:2},
  comment: {type:String, required:true, minlength:2, maxlength:255},
  _message:{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}
}, {timestamps:true})
//register our Schemas
mongoose.model('Comment', CommentSchema)

//retrieve those MOdels
var Message = mongoose.model('Message')
var Comment = mongoose.model('Comment')

/////////routes / controller logic /////////
app.get('/', function(req,res){
  console.log('in root route!');
  Message.find({}).populate('_comments').exec(function(err, messages){
    if (err) {
      res.json(err)
    }else{
      console.log(messages);
      //pass our message to view
      res.render('index',{messages:messages})
    }
  })
})
app.post('/create_message', function(req, res){

  //take in a request witht the form filled out
  console.log('messgage recieved', req.body);
  // put our information in the blueprint of what a message should be
  var message = new Message(req.body)
  //seave that message at this point
  console.log(message)
  message.save(function(err){
    //if there is an error we reender json info
    if(err) {
      res.json(err);
    }
    //else we get out of here
    else{
      res.redirect('/');
    }
  })
})
app.post('/create_comment/:message_id', function(req,res){
  console.log("PARAMS",req.body);
  ////////////////step 1/////////////////
  //lets find the message based on the informatin in our url
  Message.findOne({_id:req.params.message_id}, function(err, message){
    if (err) {
      res.json(err)
    }
    else{
      // console.log(message);
      //step 2
      //create the instance of the new create_comment
      var new_comment = new Comment(req.body)

      //step 2
      //attach the parent object to the Commentn\
      new_comment._message = message._id
      //step 4
      //step the new Comment
      new_comment.save(function(err){
        if (err) {
          res.json(err)
        }else{
          //step 5
          //update the message with the comment id
          message._comments.push(new_comment._id)
          //step 6
          //save the updated message
          message.save(function(err){
            if (err) {
              res.json(err)
            }else{
              //step 7
              //get out of here
              res.redirect('/')
            }
          })
        }
      })
    }
  })
})
app.listen(4444,function(){
  console.log('4444');
})
