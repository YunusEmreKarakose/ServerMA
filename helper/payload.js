var lora_packet = require('../node_modules/lora-packet/lib/index.js');//lora-packet library
/*
  decyprt payload from node joined with abp
*/
module.exports = {
  encodeFromBase64: function(base64payload,apps_Key,nwks_Key) {      
    var arg=base64payload;
    console.log("decoding from Base64: ", arg);
    inputData = Buffer.from(arg, 'base64');

    var packet = lora_packet.fromWire(inputData);//create lora-packet object
    console.log ("Packet Decoded")
    var res = packet.toString();
    if (nwks_Key!="" && apps_Key!="") {
      var nwkKey = Buffer.from(nwks_Key,'hex');
      var appKey = Buffer.from(apps_Key,'hex');
      var micOk = lora_packet.verifyMIC(packet, nwkKey, appKey) ? " (OK)"
                  : (" (BAD != "+asHexString(lora_packet.calculateMIC(packet, nwkKey, appKey))+")");
      var plaintext = asHexString(lora_packet.decrypt(packet, appKey, nwkKey));
      res = res.replace(/  MIC = [0-9a-fA-F]+/, '$&'+micOk);
      res = res.replace(/  FRMPayload = [0-9a-fA-F]+/, '$&\n'+
                        "             Plaintext = "+plaintext+" ('"+asAscii(plaintext)+"')");
      //create return object
      
      var retObject={      
        decryptedDataHex:plaintext,
        decryptedDataDecimal:parseInt(plaintext,16),
        phyPayload:base64payload,
        apps_Key:apps_Key,
        nwks_Key:nwks_Key
      } 
    }
    //console.log (res);
  return retObject;
  }
};


function asHexString(buf) {
    return buf.toString('hex').toUpperCase();
}

function asAscii(hex) {
    return hex.replace(/../g, function(x) {
      var code = parseInt(x, 16);
      return code >= 32 && code < 127 ? String.fromCharCode(code) : ".";
    });
}
