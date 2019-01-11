var API_BASE_PATH = CONFIG.api;
var MQTT_CONFIG = CONFIG.mqtt;
var GOOGLE_ANALYTICS_COCDE = CONFIG.googleAnalytics;
var GOOGLE_MAP_API_KEY = CONFIG.googleMapApiKey;

//properties
var PROFILE_PICTURE_PROPERTY = "user.picture";
var DOMAIN_BRANDING_PROPERTY = "domain.logobranding";

var SESSION_OBJ = Cookies.get('session_obj');
var API_TOKEN = '';

//If login restricted with the particular domain, hard code the domain key here
var DOMAIN_KEY = '';

var API_KEY = '';
var USER_OBJ = {};

if(SESSION_OBJ){
    SESSION_OBJ = JSON.parse(SESSION_OBJ);
    API_TOKEN = SESSION_OBJ.token;
    DOMAIN_KEY = SESSION_OBJ.domainKey;
    API_KEY = SESSION_OBJ.apiKey;
    USER_OBJ = SESSION_OBJ.user;
}