/*
 *  This sketch sends data via HTTP GET requests to data.sparkfun.com service.
 *
 *  You need to get streamId and privateKey at data.sparkfun.com and paste them
 *  below. Or just customize this script to talk to other HTTP servers.
 *
 */

#include <ESP8266WiFi.h>

const char* host = "cpbr.capella.pro";
const char* ssid = "CCSL4_2.4GHz";
const char* password = "flossrulez";
const char* id = "Capella";
const int port = 8000;

unsigned long previousMillis = 0;        // will store last time LED was updated


void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);
  
  Serial.begin(115200);

  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  /* Explicitly set the ESP8266 to be a WiFi-client, otherwise, it by default,
     would try to act as both a client and an access-point and could cause
     network-issues with your other WiFi-devices on your WiFi-network. */
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  delay(1000);

  Serial.print("connecting to ");
  Serial.println(host);
  
  // Use WiFiClient class to create TCP connections
  WiFiClient client;
  const int httpPort = port;
  if (client.connect(host, httpPort)) {
      Serial.println("connected");
      client.print("id"+String(id));
  }
  
  while (client.connected()) {
          unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= 500) {
    // save the last time you blinked the LED
    previousMillis = currentMillis;
    client.println();
  }
  
    // Read all the lines of the reply from server and print them to Serial
    while(client.available()){
      char info = client.read();
      if (info == '1') {
        digitalWrite(LED_BUILTIN, LOW);
        client.print("1\n");
      } else if (info == '0') {
        digitalWrite(LED_BUILTIN, HIGH);
        client.print("0\n");
      }
    }
  }
  
  Serial.println("closing connection");
}
