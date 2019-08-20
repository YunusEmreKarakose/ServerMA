//
class gpsTime{
    constructor(timeStr){
        this.year=setVar(timeStr.slice(0,4));
        this.month=setVar(timeStr.slice(5,7));
        this.day=setVar(timeStr.slice(8,10));
        this.hour=setVar(timeStr.slice(11,13));
        this.minute=setVar(timeStr.slice(14,16));
        this.sec=parseFloat(timeStr.slice(17,29));
    }
}
gpsTime.prototype.diff=function(timeObj){
    if(this.year==timeObj.year && this.month==timeObj.month
        && this.day==timeObj.day && this.hour==timeObj.hour&& this.minute==timeObj.minute){
            console.log(this.sec+"    "+timeObj.sec);
            return this.sec-timeObj.sec;
    }else{  
            console.log("aralık çok fazla");
        }
}
function setVar(array){
    if(array!=null && array!="Z"){
        return parseInt(array);
    }else{
        return 0;
    }
}
