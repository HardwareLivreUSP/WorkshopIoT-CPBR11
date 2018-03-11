/**********************************************************
* WORKSHOP CAMPUS PARTY BRASIL 11
* 31/01/2018
* HARDWARE LIVRE USP
* hardwarelivreus.org
* tiny.cc/telegram-hlu
**********************************************************/
#include <ESP8266WiFi.h>

char * id = "********COLOCAR O NOME AQUI************";

int led = D5; 
char * host = "sigex.capella.pro";
char * ssid = "SIGEX";
char * password = "hardware";
int port = 8000;

unsigned long previousMillis = 0;

void setup() {
    pinMode(led, OUTPUT);
    digitalWrite(led, LOW);

    Serial.begin(115200);

    Serial.print("Conectando ao wifi ");
    Serial.println(ssid);

    /* configura o wifi como cliente */
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);

    /* espera conectar */
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    /* mostra informações da conexão */
    Serial.println("");
    Serial.println("WiFi conectado");  
    Serial.println("IP: ");
    Serial.println(WiFi.localIP());
}

void loop() {
    delay(1000);

    Serial.print("conectando ao servidor ");
    Serial.println(host);

    /* cria conexao tcp */
    WiFiClient client;
    const int httpPort = port;
    if (client.connect(host, httpPort)) {
        /* envia o id para o servidor */
        Serial.println("conectado");
        client.println("id"+String(id));
    }


    while (client.connected()) {
        /* envia um byte para falar que esta ativo */
        /* heartbeat */
        unsigned long currentMillis = millis();
        if (currentMillis - previousMillis >= 500) {
            previousMillis = currentMillis;
            client.println();
        }

        /* verifica se a dados a serem lidos */
        while(client.available()){

            char info = client.read();

            /* liga ou desliga o led dependendo do valor 
             * recebido */
            if (info == '1') {
                digitalWrite(led, HIGH);
                client.print("1\n");
            } else if (info == '0') {
                digitalWrite(led, LOW);
                client.print("0\n");
            }
        }
    }

    Serial.println("encerrando conexao");
}
