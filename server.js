const express = require("express");
const session = require("client-sessions");
const PORT = 1234;
const app = express();
const bodyParser = require('body-parser');
const webpush = require('web-push');
const multer = require('multer');
const path = require('path');

//set static path
app.use(express.static(path.join(__dirname, 'pages')));

const publicVapidKey ='BFKiYqEmIVbUCLMwukoRwdIYXqDk1Ux_iPG4r_ZSnpGEHCYnVkZQCDk5SgWzJ4fnRvLzXBshuu3ykJ2kmJoCOGI';

const privateVapidKey ='HtgpxpXCT_FRbNdM6L_jpnGKaPFyk18hh2O27SQdyAM';

webpush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey);

//subscribe Route
app.post('/subscribe', (req, res) => {
  // Get pushSubscrition object
  const subscription = req.body;

  //send status 201 -resourse created
  res.statust(201).json({});

  //create payload
  const payload = JSON.stringify({title: 'Push Test'});

  //pass object into sendNotification
  webpush
    .sendNotification(subscription, payload)
    .catch(err => console.error(err));
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Retrieve
var db
var p
var MongoClient = require('mongodb').MongoClient; 
MongoClient.connect('mongodb+srv://user:password1234@cluster0-pjbde.mongodb.net/test?retryWrites=true&w=majority', function(err, db) {
  if(!err) {
  p = db
    console.log("Connection successful");
}
  else
  {
  db = client.db('MuDB')
  }
});


//get Login
app.use(session({
    cookieName: 'session',
    secret: 'random_string_goes_here',
    duration: 30 * 60 * 100,
    activeDuration: 5 * 60 * 1000,
  })
  );

//login page/ default page
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
  
  });

  //log in as users or Admin
app.get("/showallrecord", (req, res) => {

    const dbo = p.db("MuDB");
    
    dbo.collection('courses').find().toArray(function(err, results) {
     
    if(results)
      {
    
      console.log(results.toArray)
    
    // to see the first element
      res.send(results)
    
      }
    
    else
     console.log(err)
    
      // send HTML file populated with quotes here
    })
    
    });

  //courses search 
app.get("/allcourses", (req, res) => {

    const dbo = p.db("MuDB");
    
    dbo.collection('courses').find().toArray(function(err, results) {
     
    if(results)
      {
    
      console.log(results.toArray)
    
    // to see the first element
      res.json(results)
    
      }
    
    else
     console.log(err)
    
      // send HTML file populated with quotes here
    })
    
    });

    //show all comments 
app.get("/allcomments", (req, res) => {

    const dbo = p.db("MuDB");
    
    dbo.collection('comments').find().toArray(function(err, results) {
     
    if(results)
      {
    
      console.log(results.toArray)
    
    // to see the first element
      res.json(results)
    
      }
    
    else
     console.log(err)
    
      // send HTML file populated with quotes here
    })
    
    });


    /* GET HTML FILE */
app.get('/register', function(req, res) {

    res.sendFile(__dirname + '/pages/register.html') //create a index file 
  
  });
  app.get('/userBoard', function(req, res) {

    res.sendFile(__dirname + '/pages/userBoard.html') //create a index file 
  
  });

    ////user and Admin register 1
app.post('/form_decision', (req, res) => {
    console.log('usertype:', req.body['usertype']);
    console.log('Got Name:', req.body['name']);
  
  var u_name = req.body['name'];
  var u_pass = req.body['password'];
  var u_email = req.body['email'];
  var u_usertype = req.body['usertype'];
  
  //mongo connection for the registeration
  const dbo1 = p.db("MuDB");
  
  dbo1.collection('userdetails').save({name: u_name, email:u_email ,password:u_pass, usertype:u_usertype}, (err, result) => {
     if (err) return console.log(err)
  
     console.log('saved to database')
     res.redirect('/form_decision')
  
   })
  
  //user and Admin register 2
  if(u_usertype =='user')
    res.redirect('/userBoard');
  
  else if (u_usertype=='provider')
    res.redirect('/adminBoard');
  });

/* GET JSON */

app.get('/json', function(req, res) {

    var at = JSON.stringify({0: req.session.user, 1: req.session.user}
      )
  
    res.json({"foo": "bar"});
  
  });

  //adminBoard page
app.get("/adminBoard", (req, res) => {
    res.sendFile(__dirname + '/pages/adminBoard.html');
  
  });

  //userBoard page
app.get("/userBoard", (req, res) => {
    res.sendFile(__dirname + './pages/userBoard.html');
  
  });

  /* GET HTML FILE */
// app.get('/pages/userBoard', function(req, res) {

//     res.sendFile(__dirname + '/pages/userBoard.html') //create a index file 
    
//     //res.send("User Page");   
//     });

    app.post('/loginMsg', (req, res) => {
        console.log('Got Name:', req.body['name']);
        console.log('Got ID:', req.body['email']);
      
      var u_name = req.body['name'];
      var u_pass = req.body['password'];
      var u_email = req.body['email'];
      
      
      console.log(u_name);
      
      const dbo = p.db("MuDB");
        
      var query = { email: u_email };
      
        dbo.collection('userdetails').find(query).toArray(function(err, results) {

        if(results.length != 0) //User exists
          {
          
        // to see the first element
          // res.send('user found' +JSON.stringify(results))

          req.session.user = results[0].name;   // Saving User details in Sessions to show name across all pages
          
          console.log('user found ' + results[0].name);
            //redirect
      
                //redirect - admin and normal user
                if (results[0].usertype == "provider"){
                  res.redirect('/adminBoard');
                }                
            else if (results[0].usertype == "user"){
              res.redirect('/userBoard');
            }
                
            //     else if (results[0].adminuser == true)
            //     res.redirect('pages/adminBoard')
            // else if (results[0].adminuser == false)
            //     res.redirect('/pages/userBoard')
      
      
          }
          else if (results.length == 0)
          { 
            
            console.log('This user does not exist'); 
      
        }
        else
         console.log(err)
        
          // send HTML file populated with quotes here
        })
      
      
      
      //res.sendStatus(200);
      });

      app.post('/userBoard', (req, res) => {
        console.log('Got ID:', req.body['_id']);
        console.log('Got Name:', req.body['name']);
    
    var u_name = req.body['name'];
    var u_pass = req.body['password'];
    var u_email = req.body['email'];
    
    
    const dbo1 = p.db("MuDB");
    
    dbo1.collection('userdetails').save({Name: u_name, Email:u_email ,Password:u_pass}, (err, result) => {
       if (err) return console.log(err)
    
       console.log('saved to database')
       res.redirect('/userBoard')
    
     })
        //res.sendStatus(200);
    });

     //Postscomments
app.post('/addComments', (req, res) => {

    var u_topic = req.body['topic'];
    var u_comment = req.body['comment'];
    var u_rating = req.body['rating'];
  
  
  const dbo1 = p.db("MuDB");
  
    dbo1.collection('comments').save({topic: u_topic, comment:u_comment ,rating:u_rating}, (err, result) => {
      if(err) return console.log(err)
      console.log('Courses commented')
  
      res.redirect('/userBoard');
    })
   });

   /* UPDATE course */

app.post('/update', (req, res) => {

    const dbo2 = p.db("MuDB"); //database
    
    var u_topic = req.body['topic'];
    var u_location = req.body['location'];
    var u_price = req.body['price'];
    
      var myquery = { courses: u_topic }; //record you want to search
      var newvalues = { $set: {topic:u_topic, location:u_location,  pirce:u_price } };
    
    
      // collection
      dbo2.collection("courses").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
        res.redirect('/adminBoard')
       });
    
    });

    /* DELETE RECORD */

app.post('/delete', (req, res) => {

    const dbo2 = p.db("MuDB");
    
    var u_topic = req.body['topic'];
    
      var myquery = { courses: u_topic };
      var newvalues = { $set: {courses: u_topic} };
    
      dbo2.collection("courses").deleteOne(myquery, function(err, res) {
        if (err) throw err;
        console.log("1 course deleted");
        res.redirect('/adminBoard')
       });
    
    });

    /* Add course */
  
  app.post('/add', (req, res) => {
    console.log('topic:', req.body['topic']);
    console.log('Amount:', req.body['price']);
  
  var u_topic = req.body['topic'];
  var u_location = req.body['location'];
  var u_price = req.body['price'];
  var u_image = req.body['image'];
  
  //mongo connection for the registeration
  const dbo1 = p.db("MuDB");
  
  dbo1.collection('courses').insertOne({topic: u_topic, location:u_location ,price:u_price, image:u_image}, (err, result) => {
     if (err) return console.log(err)

    console.log('1 course saved to database');

    // to see the first element
    res.json(result);
    res.redirect('/adminBoard');

    // 5 is the limit I've defined for number of uploaded files at once
    // 'multiple_images' is the name of our file input field
    // let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).array('multiple_images', 2);
    // upload(req, res, function(err) {
    //     if (req.fileValidationError) {
    //         return res.send(req.fileValidationError);
    //     }
    //     else if (!req.file) {
    //         return res.send('Please select an image to upload');
    //     }
    //     else if (err instanceof multer.MulterError) {
    //         return res.send(err);
    //     }
    //     else if (err) {
    //         return res.send(err);
    //     }

    //     let result = "You have uploaded these images: <hr />";
    //     const files = req.files;
    //     let index, len;

    //     // Loop through all the uploaded images and display them on frontend
    //     for (index = 0, len = files.length; index < len; ++index) {
    //         result += `<img src="${files[index].path}" width="200" style="margin-right: 20px;">`;
    //     }
    //     result += '<hr/><a href="./">Upload more images</a>';
    //     res.send(result);
    // });
     
  });
  
  });
//   var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, courses);
//     },
//     filename: (req, file, cb) => {
//       console.log(file);
//       var filetype = '';
//       if(file.mimetype === 'image/gif') {
//         filetype = 'gif';
//       }
//       if(file.mimetype === 'image/png') {
//         filetype = 'png';
//       }
//       if(file.mimetype === 'image/jpeg') {
//         filetype = 'jpg';
//       }
//       cb(null, 'image-' + Date.now() + '.' + filetype);
//     }
// });
// var upload = multer({storage: storage});


// SHOW LOG THAT NODE SERVER STARTED
app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
   });