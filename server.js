const express = require("express");
const app = express();
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);

const UserModel = require('./models/user')
const mongoURI = "mongodb+srv://TinySpy:Moroccan2001@cluster0.guwuhmj.mongodb.net/Login"


mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const store = new MongoDBSession({
    uri: mongoURI,
    collection: 'myFantasy',
})

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
  secret: 'key',
  resave: false,
  saveUninitialized: false,
  store: store,
}))

const isAuth = (req,res,next) =>{
    if(req.session.isAuth){
        next()
    }else{
        res.redirect("/login")
    }
}


app.get("/", function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});
  
app.get("/login", function(req, res) {
    res.sendFile(__dirname + '/views/login.html');
});

app.post("/login", async(req, res)=>{
    const {mail,mdp} =req.body;

    const user = await UserModel.findOne({mail});

    if(!user) {
        return res.sendFile(__dirname + '/views/login.html');
    }

    req.session.isAuth = true;

    const isMatch = await bcrypt.compare(mdp,user.mdp);
    if(!isMatch) {
        return res.sendFile(__dirname + '/views/login.html');
    }

    res.sendFile(__dirname + '/views/fantasy.html');
});
  
app.get("/fantasDéconnexiony", isAuth,(req, res) => {
    res.sendFile(__dirname + '/views/fantasy.html');
});
  
app.get("/ligue", function(req, res) {
    res.sendFile(__dirname + '/views/ligue.html');
});
  
app.get("/register", function(req, res) {
    res.sendFile(__dirname + '/views/register.html');
});

app.post("/register", async (req,res)=>{
    const {nom,prenom,mail,mdp,date,pays} =req.body;

    let user = await UserModel.findOne({mail});

    if(user){
        return res.sendFile(__dirname + '/views/register.html');
    }

    const hashedMdp = await bcrypt.hash(mdp,12);

    user = new UserModel({
        nom,
        prenom,
        mail,
        mdp: hashedMdp,
        date,
        pays
    })

    await user.save();

    res.redirect("/login");
});

app.post("/logout",async (req, res) =>{
    req.session.destroy((err) =>{
        if(err) throw err;
        res.redirect("/");
    });
});

app.listen(3000, function() {
    console.log("server is running on 3000");
});