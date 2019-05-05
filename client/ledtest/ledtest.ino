#include <ESP8266WiFi.h>
#include <WebSocketClient.h>
#include "config.h"

extern const char* ssid;
extern const char* password; 

char* hostIp = "192.168.0.101";

#define LED_R   4
#define LED_G   2
#define LED_B   5

WebSocketClient webSocketClient;
WiFiClient client;

int currentRed = 255;
int currentGreen = 0;
int currentBlue = 0;

void led_set_color(uint r, uint g, uint b) {
  analogWrite(LED_R, r);
  analogWrite(LED_G, g);
  analogWrite(LED_B, b);
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(74880);
  delay(10);

  connectToServer();
  
  led_set_color(currentRed, currentGreen, currentBlue);
}

void connectToServer() {
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  // Connect to the websocket server
  if (client.connect(hostIp, 8080)) {
    Serial.println("Connected");
  } else {
    Serial.println("Connection failed.");
    while(1) {
      // Hang on failure
    }
  }    

  webSocketClient.host = hostIp;
  webSocketClient.path = "/";
  
  if (webSocketClient.handshake(client)) {
    Serial.println("Handshake successful");
  } else {
    Serial.println("Handshake failed.");
  }  
  
  webSocketClient.sendData(String("pixel " + String(PIXEL_ID, DEC)).c_str());  
}

void loop() {
  // put your main code here, to run repeatedly:
  String data;
  int newR, newG, newB;
 
  if (client.connected()) {
    webSocketClient.getData(data);
    if (data.length() > 0) {
      Serial.println(data);
      if (data.charAt(0) == 'c') {
        newR = data.substring(1, 4).toInt();
        newG = data.substring(4, 7).toInt();
        newB = data.substring(7, 10).toInt();
        led_set_color(newR, newG, newB);
      }
    }
 
  } else {
    Serial.println("Client disconnected, reconnecting");
    connectToServer();
  }
 
  delay(33);
}
