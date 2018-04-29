var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
const url = 'mongodb://localhost:27017'; 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// https://www.youtube.com/watch?v=Do_Hsb_Hs3c&t=4s
// https://stackoverflow.com/questions/47662220/db-collection-is-not-a-function-when-using-mongoclient-v3-0/47662979
// hent alle studerende
router.get('/allestuderende', function (req, res){
  var MongoClient = mongodb.MongoClient;

  MongoClient.connect(url, (err, client) => {
  // Client returned
    if(err){
      console.log(err);
    }else{
      var db = client.db('samplesite');
      console.log('Virker');
      var collection = db.collection('students');
      collection.find({}).toArray(function (err, result){
        client.close();
        if(err){
          console.log('Der opstod en fejl!',err);
        }else if(result.length){
          res.render('studentlist', {
            "studentlist": result
          });
        }else{
          res.send('Ingen rækker fundet: '+ result.length);
        }
      });
    }
  });
});

router.get('/nystuderende', (req, res)=>{
  res.render('newstudent', {title: 'Ny studerende'});
});

router.get('/redigerstuderende/:id/:name/:street', (req, res)=>{
  res.render('opdaterstudent', {
    title: 'Opdater studerende',
    id: req.params.id,
    name: req.params.name,
    street: req.params.street
  });
});

router.post('/addstuderende', (req, res)=>{
  var MongoClient = mongodb.MongoClient;
  MongoClient.connect(url, (err, client) => {
    // Client returned
    if(err){
      console.log('Fejl: ' + err);
    }else{
      var db = client.db('samplesite');
      var collection = db.collection('students');
      var student1 = {student: req.body.studentName, street: req.body.streetName};
      collection.insert([student1], (err, result)=>{
        client.close();
        if(err){
          console.log(err);
        }else{
          res.redirect('allestuderende');
        }
      });
    }
  });  
});

router.post('/sletstuderende', (req, res)=>{
  var MongoClient = mongodb.MongoClient;
  MongoClient.connect(url, (err, client) => {
    // Client returned
    if(err){
      console.log('Fejl: ' + err);
    }else{
      console.log(req.body.studentId);
      var db = client.db('samplesite');
      var collection = db.collection('students');
      var studentId = req.body.studentId;
      var ObjectId = require('mongodb').ObjectID;
      collection.deleteOne({"_id": ObjectId(studentId)}, (err, result)=>{
        client.close();
        if(err){
          console.log(err);
        }else{
          res.redirect('allestuderende');
        }
      });
    }
  });  
});

router.post('/gemopdateringafstuderende', (req, res)=>{
  var MongoClient = mongodb.MongoClient;
  MongoClient.connect(url, (err, client) => {
    // Client returned
    if(err){
      console.log('Fejl: ' + err);
    }else{
      var db = client.db('samplesite');
      var collection = db.collection('students');
      var item = {
        student: req.body.studentName,
        street: req.body.streetName
      };
      var studentId = req.body.studentId;
      var ObjectId = require('mongodb').ObjectID;
      collection.updateOne({"_id": ObjectId(studentId)},{$set: item}, (err, result)=>{
        client.close();
        if(err){
          console.log(err);
        }else{
          res.redirect('allestuderende');
        }
      });
    }
  });  
});
module.exports = router;
