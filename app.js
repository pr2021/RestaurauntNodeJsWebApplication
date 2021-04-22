var express = require('express');
const bodyParser = require('body-parser');
var app = express();
const { Pool} = require('pg');
var path = require("path");


var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
  auth: {
    user: 'prajval.narasimha@gmail.com',
    pass: 'fxgyqdapwqpozyog'
  }
});



const pool = new Pool({
  user: 'postgres',
  host: 'database-1.c1mxmtuo85dq.us-east-1.rds.amazonaws.com',
  database: 'postgres',
  password: 'Welcome1234',
  port: 5433,
})

var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs');
const maxTables = 9;

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var tables = [];
var availableTables = 0;
maxPersonInEachTable = 5;
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
/*
app.get('/', (req, res) => {
    console.log(tables[0]);
    pool.query('SELECT "User", "Email", "Phone", "noOfPeople", "Preference", "Date", "Time", id FROM public."Registration"', (err, result) => {
        console.log(err, result);
        res.send(JSON.stringify("Available Tables:"+result.rowCount))
      })
    
  })*/

  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
  });

  app.get("/menu", function(req, res) {
    res.sendFile(path.join(__dirname, "public/menu.html"));
  });

app.post("/api/new", function(req,res){
  var newArray = tables.filter(function (el){
el.date = req.body.Date;
el.time = req.body.Time;
  })
availableTables = newArray.length;
if(availableTables < maxTables){  
  const table = req.body;  
  tables.push(table);
  console.log(tables);
  console.log(table);
  console.log(JSON.stringify(req.body));
  var mailOptions = {
    from: 'prajval.narasimha@gmail.com',
    to: JSON.stringify(req.body.Email),
    subject: 'Table Booked',
    text: 'Table has been booked for ' + req.body.Date + 'at' + req.body.Time
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  return res.send("success");
}
else{
  return res.send("failed");
}
});
app.post("/api/delete", function(req,res){

  for(var i =0;i < tables.length;i++){
    var email = tables[i].Email;
    var date = tables[i].Date;
    console.log(tables[i]);
    if(email == req.body.Email && date ==  req.body.Date){
      tables.splice(JSON.stringify(tables[i]),1);
      var mailOptions = {
    from: 'prajval.narasimha@gmail.com',
    to: JSON.stringify(req.body.Email),
    subject: 'Table Cancelled',
    text: 'Table ooked for ' + req.body.Date + 'has been cancelled.'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
      return res.send("success");
    }
    else{
      return res.send("failed");
    }
  }
 });

 app.post("/api/update", function(req,res){
   for(var i =0;i < tables.length;i++){
    var email = tables[i].Email;
    var date = tables[i].Date;
    if(email == req.body.Email && date ==  req.body.Date){
      tables.splice(JSON.stringify(tables[i]),1);
    }
  }
 var newArray = tables.filter(function (el){
  el.date = req.body.newdate;
  el.time = req.body.Time;
    })
  availableTables = newArray.length;
  if(availableTables < maxTables){  
    const table = req.body;  
    tables.push(table);
    console.log(table);
    var mailOptions = {
    from: 'prajval.narasimha@gmail.com',
    to: JSON.stringify(req.body.Email),
    subject: 'Table Updated',
    text: 'Table has been updated for ' + req.body.newdate + 'at' + req.body.Time
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
 return res.send("success");
   } 
   else{
     return res.send("failed");
   }
  });


/*
pool.query('SELECT "User", "Email", "Phone", "noOfPeople", "Preference", "Date", "Time", id FROM public."Registration" where "Date" = $1::date and "Time" = $2::time;',[req.body.Date,req.body.Time] ,(err, result) => {
    console.log(err, result);
    availableTables = result.rowCount;
    console.log(availableTables);
   
      pool.query('INSERT INTO public."Registration"("User", "Email", "Phone", "noOfPeople", "Preference", "Date", "Time") VALUES ($1::text, $2::text, $3::text, $4::integer, $5::text, $6::date, $7::time);',[req.body.User,req.body.Email,req.body.Phone,req.body.noOfPeople,req.body.Preference,req.body.Date,req.body.Time] ,(err, result) => {
          console.log(err, result)
          //pool.end();
          if(result.rowCount == 1)
          {
          return res.send("success");
          }
          else{
            return res.send("failed");
          }
        })
  }
  else{
    return res.send("Sorry there are no tables available as per your request");
  }
  
})*/


app.listen(port, function() {
  console.log('Server running at http://127.0.0.1:%s', port);
});