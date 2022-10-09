const express = require('express')
const app = express();
const port = 3000;
const request=require('request');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
var serviceAccount = require("./key.json");
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
app.use(express.static(__dirname+'/public'));
app.set("view engine","ejs");

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/movies', (req, res) => {
  
    res.render('loginSignup');
  })
  app.get('/signupsubmit', (req, res) => {
    const Susername=req.query.Susername;
    const Spwd=req.query.Spwd;
    const Semail=req.query.Semail;
  db.collection('users').add({
    username:Susername,
    email:Semail,
    password:Spwd
}).then(()=>{
  
    res.render('loginSignup');
});
  });

app.get('/loginsubmit', (req, res) => {
    const password=req.query.Lpwd;
    const username=req.query.Lusername;
db.collection('users')
   .where("username",'==',username)
   .where("password",'==',password)
   .get()
   .then((docs)=>{
       if(docs.size>0){
        res.render('movieSearch');
    
       }
       else{
        res.send("Login failed ");
       }
    });
   });

app.get("/movieName",function(req,res){
    const nameofmovie=req.query.moviename;
    request(
        'http://www.omdbapi.com/?t='+nameofmovie+'&apikey=e2407a46', function (error, response, body) {
  if(JSON.parse(body).Response=="True"){
        /*res.render('movieinfo');*/
      const Poster=JSON.parse(body).Poster;
      const Title=JSON.parse(body).Title;
      const Year= JSON.parse(body).Year;
      const imdbRating= JSON.parse(body).imdbRating;
      const Released =JSON.parse(body).Released;
      const Genre= JSON.parse(body).Genre;
      const Director=JSON.parse(body).Director;
      const Writer=JSON.parse(body).Writer;
      const Actors= JSON.parse(body).Actors;
      const Plot= JSON.parse(body).Plot ;
      const Language=JSON.parse(body).Language;
      const BoxOffice= JSON.parse(body).BoxOffice;
     res.render('movieinfo',{Poster:Poster,Title:Title,Year:Year,imdbRating:imdbRating,Released:Released,Genre:Genre,Director:Director,Writer:Writer,Actors:Actors,Plot:Plot,Language:Language,BoxOffice:BoxOffice});
  }
  else{
     res.render('movienotfound');
  }
}
);
});
app.get("/gotomoviesearch",function(req,res){
  res.render('movieSearch');
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})