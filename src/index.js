const bp = require('body-parser');
const express=require('express');
const app=express();
const userroute=require('../route/user')
const path=require('path')
const { engine }=require('express-handlebars')
app.use(bp.urlencoded());

app.use(express.static(path.join(__dirname,'..','public')));
app.engine('hbs',engine({extname:'.hbs',defaultLayout:false}));
app.set('view engine','hbs');
app.set('views','views');
app.use(userroute);
app.listen(3000,()=>{
    console.log("HII");
});