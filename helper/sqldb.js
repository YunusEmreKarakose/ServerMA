var mysql=require('mysql');

//localhost
const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'networkserverv1'
  });
  
//bağlanma
db.connect(function(err){
    if(err){    console.log("mysql connect error ::"+err); throw err;}
    else{console.log("mysql connected");}
});

module.exports=db;