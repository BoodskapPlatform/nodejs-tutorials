const async = require('async');
const PropertiesReader = require('properties-reader');
const fs = require('fs');

const prop = PropertiesReader('boodskap.properties');

var serverPort = 'server.port';
var mqttHost = 'mqtt.host';
var mqttPort = 'mqtt.port';
var mqttSSL = 'mqtt.ssl';
var apiPath = 'boodskap.api';

var googleAnalytics = 'google.analytics.id';
var googleMapKey = 'google.map.key';

//Get the property value
getProperty = (pty) => {return prop.get(pty);}
console.log("***************************************" +
    "\nBoodskap IoT Platform\n" +
            "***************************************")
async.series({
    'serverConfig' : function (scbk) {

        /****************************
         1] Configuring Server Properties
         ****************************/

        let txt = 'var config = {port:'+getProperty(serverPort)+'};\nmodule.exports=config;';
        fs.writeFile('config.js', txt, (err) => {
            if (err){
                console.error('Error in configuring server properties')
                scbk(null,null);
            }else{
                console.error('1] Setting server properties success')
                scbk(null,null);
            }
        });

    },
     'webConfig' : function (wcbk) {

        /****************************
         2] Configuring Web Properties
         ****************************/

        let txt = 'var CONFIG={"api":"'+getProperty(apiPath)+'","mqtt":{"hostName":"'+getProperty(mqttHost)+'","portNo":'+getProperty(mqttPort)+',"ssl":'+getProperty(mqttSSL)+'},' +
            '"googleAnalytics":"'+(getProperty(googleAnalytics) ? getProperty(googleAnalytics) : '')+'",' +
            '"googleMapApiKey":"'+(getProperty(googleMapKey) ? getProperty(googleMapKey) : '')+'"}';

         fs.writeFile('./webapps/platform-config.js', txt, (err) => {
             if (err){
                 console.error('Error in configuring web properties')
                 wcbk(null,null);
             }else{
                 console.error('2] Setting web properties success')
                 wcbk(null,null);
             }
         });

    }
}, function (err, result) {
    console.log(new Date() + ' | Boodskap UI Build Success');
    console.log('Now execute > npm start');
})



