/**********************************************************
* WORKSHOP CAMPUS PARTY BRASIL 11
* 31/01/2018
* HARDWARE LIVRE USP
* hardwarelivreus.org
* tiny.cc/telegram-hlu
**********************************************************/
void setup() {
  pinMode(D5, OUTPUT);
}

void loop() {
  digitalWrite(D5, HIGH);
  delay(1000);
  digitalWrite(D5, LOW);
  delay(1000);
}
