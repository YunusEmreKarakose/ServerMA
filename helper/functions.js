const fs=require('fs');
const mysql=require('./sqldb');

  module.exports = {
    createTopicList:function(topicList,gatewayList){//create topiclist that server ll listen
      for(var i=0;i<gatewayList.length;i++){
        topicList.push('gateway/'+gatewayList[i]+'/stats');
        topicList.push('gateway/'+gatewayList[i]+'/rx',);
      }
    },
    readGatewaysId:function(gatewayList){//read gwid from conf.json and set list      
      var data=fs.readFileSync('./cfg/conf.json', 'utf8');
      var tmp=JSON.parse(data);
      for(var i=0;i<tmp.gatewayList.length;i++){
        gatewayList.push(tmp.gatewayList[i].gatewayId);
      }
    },
    readDeviceList:function(deviceList){
      var data=fs.readFileSync('./cfg/conf.json', 'utf8');
      var tmp=JSON.parse(data);
      for(var i=0;i<tmp.deviceList.length;i++){
        deviceList.list.push({devId:tmp.deviceList[i].deviceId,
                              rssiAtOneMeter:tmp.deviceList[i].rssiAtOneMeter,
                              frequency:tmp.deviceList[i].frequency});
      }
    },
    decyprt:function(payload,data){//decyprt incoming payload
      var str=Buffer.from(payload, 'base64');
      console.log(str);
      data.deviceId=str[0];
      data.decyprted={
        x:Buffer.from(str.slice(1,5),'base64').readFloatLE(),
        y:Buffer.from(str.slice(5,9),'base64').readFloatLE(),//kucuk sonlu
        z:Buffer.from(str.slice(9,13),'base64').readFloatLE(),//little endian
        hr:str[13]
      };
      data.rxdata={
        nodeId:str[14],
        x:str[15],
        y:str[16],
        rssi:str[17]
        
      }
    },
    decyprtNode:function(payload,data){//decyprt incoming payload
      var str=Buffer.from(payload, 'base64');
      data.deviceId=str[0];
      data.x=str[1];
      data.y=str[2];
    },
    createTables:function(gatewayList){//create tables for gw/id/rx 
      for(var i=0;i<gatewayList.length;i++){
        let createTable = `create table if not exists gw`+gatewayList[i]+`rx (
                dataId int primary key auto_increment,
                devId int not null,
                gwId varchar(50) not null,
                rssi int not null,
                filteredRssi int,
                distance float,
                gpsEpoch varchar(50) not null,
                newDate varchar(50) not null,
                time varchar(50) not null,
                hr int,
                x float,
                y float,
                z float,
                isMapped tinyint(1) not null default 0
              )`;
  
        mysql.query(createTable, function(err, results, fields) {
        if (err) {
        console.log(err.message);
        }
        });
      }
    },
    writeMysql:function(data,tableName){//write data to mysql table(tableName)
      var sqldata={
        devId:data.deviceId,
        gwId:data.gatewayId,
        rssi:data.rssi,
        filteredRssi:data.filteredRssi,
        distance:data.distance,
        gpsEpoch:data.timeSinceGPSEpoch,
        newDate:new Date(),
        time:data.time,
        x:data.decyprted.x,
        y:data.decyprted.y,
        z:data.decyprted.z,
        hr:data.decyprted.hr
      }
      let sqlstr='INSERT INTO '+tableName+' SET ?';
      let query=mysql.query(sqlstr,sqldata,function(err,result){
      if(err){console.log("Database Error!!!"+err);}
      else{console.log("MySQL write ok::"+sqldata.devId);         }
      });
    }    
  };