const math=require('mathjs');
var mysql=require('./sqldb');
var KalmanFilter = require('kalmanjs'); 
module.exports ={
    rssiKalman1:function(){//kalman filter from all db
        var kalmanFilter = new KalmanFilter({R: 0.01, Q: 10}); 
        var resultsRssi=[];
        return new Promise((resolve, reject) => {
            let sqlstr="SELECT rssi FROM gwb827ebfffe81c028rx"
            mysql.query(sqlstr, function(err, results, fields) {
                    if (err) {
                        reject(err);
                    }else{
                        results.forEach(element => {
                            resultsRssi.push(element.rssi);
                        });
                        var dataConstantKalman = resultsRssi.map(function(v) {
                            return kalmanFilter.filter(v);
                            });
                        var i=dataConstantKalman.length-1;
                        resolve(dataConstantKalman[i]);
                    }
                });
        });     
    },
    rssiKalman2:function(){//kalman filter last 10 row from db     
        var kalmanFilter = new KalmanFilter({R: 0.01, Q: 10});
        var resultsRssi=[];
        return new Promise((resolve, reject) => {
            let sqlstr="SELECT rssi FROM gwb827ebfffe81c028rx ORDER BY dataId DESC LIMIT 10"
            mysql.query(sqlstr, function(err, results, fields) {
                    if (err) {
                        reject(err);
                    }else{
                        results.forEach(element => {
                            resultsRssi.push(element.rssi);
                        });
                        var dataConstantKalman = resultsRssi.map(function(v) {
                            return kalmanFilter.filter(v);
                            });
                        var i=dataConstantKalman.length-1;
                        resolve(dataConstantKalman[i]);
                    }
                });
        });     
    }
}
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