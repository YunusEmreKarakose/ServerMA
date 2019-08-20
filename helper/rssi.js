const math=require('mathjs');
const fs=require('fs');
module.exports={
    rssiDistance:function (rssi,rssiAtOneM,N){
        if(rssi!=null){
            var x=(rssiAtOneM-rssi)/(10*N);
            return math.pow(10,x);        
        }else{
            return -1;
        }
    },
    rssiTrilateration:function(data){
        var matrix=create2DArray(data.length);
        for(var i=0;i<data.length;i++){
            matrix[i][0]=data1[i].x;
            matrix[i][1]=data1[i].y;
            matrix[i][2]=data1[i].d;
        }
    }
}
function create2DArray(rows) {
    var arr = [];  
    for (var i=0;i<rows;i++) {
       arr[i] = [];
    }  
    return arr;
}