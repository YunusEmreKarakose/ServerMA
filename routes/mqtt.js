const express = require('express');
const router = express.Router();
const math=require('mathjs');
const KalmanFilter=require('kalmanjs');
const mqtt=require('mqtt');//MQTT Lib
const client=mqtt.connect('mqtt://192.168.12.1:1883');//mqtt ip:port
var f=require('../helper/functions');
//Get gateway list from "conf.json"
var gatewayList=[];
f.readGatewaysId(gatewayList);//set gatewaylist array
f.createTables(gatewayList);//create mysql tables for each gateway
//Get device list from "conf.json"
var deviceList={
  list:[]
};
f.readDeviceList(deviceList);
//Kalman Filter TEST(create a kalman filter object for each device)
var kfArray=[];
deviceList.list.forEach(element => {//kalmanFilter[].filter(x);
    kfArray.push(new KalmanFilter({R: 0.01, Q: 10}));
});
//MQTT https://blog.risingstack.com/getting-started-with-nodejs-and-mqtt/
/* GET data mosquitto */  
  /*topic list that server listens (odd indexes(except 0) stats, even indexes rx)
  (gatewayList[i] topics topicList[2i]=stats && topicList[2i+1]=rx)  */
  var topicList=[];
  f.createTopicList(topicList,gatewayList);
  //subscribe topic/topics
  client.on('connect', () => {
    client.subscribe(topicList);  
  })
  //Topic Event Listener
  client.on('message', (topic, message) => {
    for(var i=0;i<gatewayList.length;i++){        
      if(topic==topicList[2*i]){//STATS  
        //console.log(topicList[0]+" MESAJ ");
        //console.log(JSON.parse(message));
      }
      if(topic==topicList[2*i+1]){//RX
        var tmp=JSON.parse(message);
        //console.log(tmp);
        //join abp with appskey and nwkskey
        /*var tmp2=payload.encodeFromBase64(tmp.phyPayload,apps_Key,nwks_Key);   
        var data={
          gatewayId:tmp.rxInfo.mac,
          timestamp:tmp.rxInfo.timestamp,
          date:new Date(tmp.rxInfo.timestamp),
          phyPayload:tmp.phyPayload,
          decryptedDataHex:tmp2.decryptedDataHex,
          decryptedDataDecimal:tmp2.decryptedDataDecimal,
          apps_Key:tmp2.apps_Key,
          nwks_Key:tmp2.nwks_Key
          }*/
        if(tmp.rxInfo.frequency!=868100000){//sabit nodeları kullanma //tmp.rxInfo.frequency!=868100000
          //without a crypto or auth method
          var data={        
            gatewayId:tmp.rxInfo.mac,
            deviceId:-1,
            time:tmp.rxInfo.time,
            timeSinceGPSEpoch:tmp.rxInfo.timeSinceGPSEpoch,
            timestamp:tmp.rxInfo.timestamp,
            phyPayload:tmp.phyPayload,
            rssi:tmp.rxInfo.rssi,
            filteredRssi:0,
            distance:0,
            decyprted:{
              x:-1,
              y:-1,
              z:-1,
              hr:-1
            }
          }        
          var tableName="gw"+data.gatewayId+"rx";
          f.decyprt(tmp.phyPayload,data);//decyrpt payload and add into data       
          //Find device and its kalmanfilter object , filter rssi and add into data
          for(var i=0;i<deviceList.list.length;i++){
            if(deviceList.list[i].devId==data.deviceId){
              data.filteredRssi=kfArray[i].filter(tmp.rxInfo.rssi);
              data.distance=rssiDistance(data.filteredRssi,deviceList.list[i].rssiAtOneMeter,2.2)
            }          
          }
          console.log(data);     
          //f.writeMysql(data,tableName);
        }//endif
      }//endif
    }//end for
  })//end listener

function rssiDistance(rssi,rssiAtOneM,N){
  if(rssi!=null){
      var x=(rssiAtOneM-rssi)/(10*N);
      return math.pow(10,x);        
  }else{
      return -1;
  }
}
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
}

module.exports = router;