
#include "handleWebpage.h"

ESP8266WebServer* HandleWebpage::_webServer = nullptr;

HandleWebpage::HandleWebpage()
{
  _webServer = new ESP8266WebServer(80);
};

void HandleWebpage::handleRoot() {                         // When URI / is requested, send a web page with a button to toggle the LED
  handleWebRequests();
}

void HandleWebpage::setCallBackSetGain(CallBackSetGain callBackSetGain)
{
  _callBackSetGain = callBackSetGain;
}

void HandleWebpage::setCallBackGetGain(CallBackGetGain callBackGetGain)
{
  _callBackGetGain = callBackGetGain;
}

void HandleWebpage::setCallBackPlaySound(CallBackPlaySound callBackPlaySound)
{
  _callBackPlaySound = callBackPlaySound;
}

void HandleWebpage::handleSetGain(){
  Serial.println("handleSetGain: " + _webServer->arg("plain"));
  if (_callBackSetGain != nullptr)
  {
    if(_webServer->hasArg("gain"))
    {
      int gainSound = _webServer->arg("gain").toInt();
      if (_callBackSetGain != nullptr)
      {
        _callBackSetGain(gainSound);
      }
      else
      {
        Serial.println("Error: _callBackSetGain == nullptr");
      }
      
      _webServer->send(200, "text/plane", "{\"success\": true}");
    }
    else
    {
      Serial.println("Error handleSetGain: missing argument gain!");
      _webServer->send(200, "text/plane", "{\"success\": false}");
    }
  }
  else
  {
    Serial.println("Error: _callBackSetGain == nullptr");
    _webServer->send(200, "text/plane", "{\"success\": false}");
  }
}

void HandleWebpage::handlePlaySound() {
  Serial.println("handlePlaySound" + _webServer->arg("plain"));
  if(_callBackPlaySound !=nullptr)
  {
    _callBackPlaySound();
  }
  else
  {
    Serial.println("Error: _callBackPlaySound ==nullptr");
    _webServer->send(200, "text/plane", "{\"success\": false}");
  }
  
  
}

void HandleWebpage::handleGetValues() {  
  String strGainSound = "0";
  if (_callBackGetGain != nullptr)
  {
    strGainSound = String(_callBackGetGain());
  }
  else
  {
    Serial.println("Error: _callBackGetGainSound == null");
  }
  
  String jsonAnswer = "{\"gain\": " + strGainSound + "}";
  Serial.println("handleGetValues :send  value: " + jsonAnswer);
  _webServer->send(200, "text/plane", jsonAnswer);
}

void HandleWebpage::handleWebRequests(){
  if(!loadFromLittleFS(_webServer->uri()))
  {
    Serial.println("Error: handleWebRequests");
    String message = "File Not Detected\n\n";
    message += "URI: ";
    message += _webServer->uri();
    message += "\nMethod: ";
    message += (_webServer->method() == HTTP_GET)?"GET":"POST";
    message += "\nArguments: ";
    message += _webServer->args();
    message += "\n";
    for (uint8_t i=0; i < _webServer->args(); i++){
      message += " NAME:" + _webServer->argName(i) + "\n VALUE:" + _webServer->arg(i) + "\n";
    }
    _webServer->send(404, "text/plain", message);
    //Serial.println(message);
  }
}

bool HandleWebpage::loadFromLittleFS(String path){
  bool returnValue = true;
  Serial.println("Load path: " + path);
  String dataType = "text/plain";

  if(path.endsWith("/")) path += "index.html";
 
  if(path.endsWith(".src")) path = path.substring(0, path.lastIndexOf("."));
  else if(path.endsWith(".html")) dataType = "text/html";
  else if(path.endsWith(".htm")) dataType = "text/html";
  else if(path.endsWith(".css")) dataType = "text/css";
  else if(path.endsWith(".js")) dataType = "application/javascript";
  else if(path.endsWith(".png")) dataType = "image/png";
  else if(path.endsWith(".gif")) dataType = "image/gif";
  else if(path.endsWith(".jpg")) dataType = "image/jpeg";
  else if(path.endsWith(".ico")) dataType = "image/x-icon";
  else if(path.endsWith(".xml")) dataType = "text/xml";
  else if(path.endsWith(".pdf")) dataType = "application/pdf";
  else if(path.endsWith(".zip")) dataType = "application/zip";
  if (LittleFS.exists(path))
  {
    File dataFile = LittleFS.open(path.c_str(), "r");
    if (_webServer->hasArg("download")) dataType = "application/octet-stream";

    if (_webServer->streamFile(dataFile, dataType) != dataFile.size()) {
      //Serial.println("Error: streamed file has different size!");
      //returnValue = false;
    }
    dataFile.close();
  }
  else
  {
    Serial.println("Error: Path does not exist and will be redirect to root:");
    Serial.println(path);
    returnValue = loadFromLittleFS("/");
  }
  return returnValue;
}

void HandleWebpage::setupHandleWebpage()
{
    // replay to all requests with same HTML
  _webServer->onNotFound(std::bind(&HandleWebpage::handleWebRequests, this));

  // replay to all requests with same HTML
  //Information about using std::bind -> https://github.com/esp8266/Arduino/issues/1711

  _webServer->on("/", HTTP_GET, std::bind(&HandleWebpage::handleRoot, this));
  _webServer->on("/getValues", HTTP_GET, std::bind(&HandleWebpage::handleGetValues, this));
  _webServer->on("/playSound", HTTP_GET, std::bind(&HandleWebpage::handlePlaySound, this));
  _webServer->on("/setGain", HTTP_POST, std::bind(&HandleWebpage::handleSetGain, this));
  //webServer.on("/config/changed", HTTP_POST, configChanged);
  _webServer->begin();
}

void HandleWebpage::sendSuccess()
{
  _webServer->send(200, "text/plane", "{\"success\": true}");
}

void HandleWebpage::handleClient()
{
  _webServer->handleClient();
}