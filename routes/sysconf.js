var express = require('express');
var router = express.Router();
var fs = require('fs');

/* Read Config File */
router.get('/readCfg', function(req, res, next) {
        fs.readFile('./cfg/conf.json', 'utf8', function readFileCallback(err, data){
          if (err){
              res.send(err);
          }else {
              res.json(JSON.parse(data));
            }
        }); 
});
/* createGateway */
router.post('/createGateway', function(req, res, next) {
        var gateway={
            gatewayId:req.body.gatewayId,
            x        :req.body.x,
            y        :req.body.y     
        }
        fs.readFile('./cfg/conf.json', 'utf8', function readFileCallback(err, data){
          if (err){
              res.send(err);
          }else {
              var tmp=JSON.parse(data);
              //search for gateway if exists
              var condition=false;
              for(var i=0;i<tmp.gatewayList.length;i++){
                  if(tmp.gatewayList[i].gatewayId==gateway.gatewayId){
                      condition=true;
                  }
              }
              //
              if(condition==false){                
                tmp.gatewayList.push(gateway);
                fs.writeFile('./cfg/conf.json', JSON.stringify(tmp), 'utf8', (err)=>{
                    if(err) throw err;                    
                    res.send("gateway created");
                });                
              }else{
                res.send("gateway already exists");
              }
            }
        }); 
});
/* createDevice */
router.post('/createDevice', function(req, res, next) {
        var device={
            deviceId:req.body.deviceId,
            rssiAtOneMeter:req.body.rssiAtOneMeter,
            frequency:req.body.frequency            
        }
        fs.readFile('./cfg/conf.json', 'utf8', function readFileCallback(err, data){
          if (err){
              res.send(err);
          }else {
              var tmp=JSON.parse(data);
              //search for gateway if exists
              var condition=false;
              for(var i=0;i<tmp.deviceList.length;i++){
                  if(tmp.deviceList[i].deviceId==device.deviceId){
                      condition=true;
                  }
              }
              //
              if(condition==false){                
                tmp.deviceList.push(device);
                fs.writeFile('./cfg/conf.json', JSON.stringify(tmp), 'utf8', (err)=>{
                    if(err) throw err;                    
                    res.send("device created");
                });                
              }else{
                res.send("device already exists");
              }
            }
        }); 
});
/* create immobile nodes */
router.post('/createNode', function(req, res, next) {
        var node={
            nodeId:req.body.nodeId,
            rssiAtOneMeter:req.body.rssiAtOneMeter,
            frequency:req.body.frequency,
            x:req.body.x,
            y:req.body.y            
        }
        fs.readFile('./cfg/conf.json', 'utf8', function readFileCallback(err, data){
          if (err){
              res.send(err);
          }else {
              var tmp=JSON.parse(data);
              //search for gateway if exists
              var condition=false;
              for(var i=0;i<tmp.nodeList.length;i++){
                  if(tmp.nodeList[i].nodeId==node.nodeId){
                      condition=true;
                  }
              }
              //
              if(condition==false){                
                tmp.nodeList.push(node);
                fs.writeFile('./cfg/conf.json', JSON.stringify(tmp), 'utf8', (err)=>{
                    if(err) throw err;                    
                    res.send("Node created");
                });                
              }else{
                res.send("Node already exists");
              }
            }
        }); 
});

/* define apps_key&nwks_key */
router.post('/keysForAbp', function(req, res, next) {
    fs.readFile('./cfg/conf.json', 'utf8', function readFileCallback(err, data){
      if (err){
          res.send(err);
      }else {
        var tmp=JSON.parse(data);
        tmp.apps_key=req.body.apps_key;
        tmp.nwks_key=req.body.nwks_key;
        fs.writeFile('./cfg/conf.json', JSON.stringify(tmp), 'utf8', (err)=>{
            if(err) throw err;                    
            res.send("key defined");
        });
        }
    }); 
});

module.exports = router;
