var fs = require('fs');//for dev

function wFile(parsed){
    fs.readFile('../data.json', 'utf8', function readFileCallback(err, data){
      if (err){
          console.log(err);
      } else {
      var d=JSON.parse(data);//
      d.data.push(parsed);
      json = JSON.stringify(d); //convert it back to json
      fs.writeFile('../data.json', json, 'utf8', (err)=>{
        if(err) throw err;
        console.log("wf ok\n");
      }); // write it back 
  }});
  }
// //OLD TOPİC LİST
// var topicList=[
//   'gateway/'+gwid+'/stats',
//   'gateway/'+gwid+'/rx',
//   'gateway/'+gwid+'/tx',
//   'gateway/'+gwid+'/ack',
//   'aplication/3/device/539ef852aa434395/rx/'
//   ];