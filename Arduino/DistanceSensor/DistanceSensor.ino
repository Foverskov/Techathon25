/*
  Sharp 2Y0A02 Distance Sensor
  
  Reads an analog input from the Sharp GP2Y0A02YK0F distance sensor,
  converts it to distance in cm.
  
  The circuit:
   * Alert Pin to digital pin 2
   * Sharp Sensor Vo to Analog pin A0
   * Sharp Sensor Vcc to 5V
   * Sharp Sensor GND to GND
   * Servo Signal to digital pin 9
*/

#include <Servo.h>

const int sensorPinOut = A0;
const int alertPin = 2;

Servo myServo;

void setup() {
  pinMode(alertPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // Read the analog value from the sensor (0 - 1023)
  int outSensor = analogRead(sensorPinOut);
  
  // Convert the analog value (0-1023) to voltage (0-5V)
  float outVolts = outSensor * (5.0 / 1023.0);
  // Calculate distance in cm for GP2Y0A41SK0F (4-30cm range)
  // The relationship between voltage and distance is non-linear.
  // A common power regression formula for this sensor is:
  // Distance = 12.08 * Voltage^-1.058
  float outDistance = 12.08 * pow(outVolts, -1.058);
  digitalWrite(alertPin, HIGH);

  Serial.print("Raw: ");
  Serial.print(outSensor);
  Serial.print(" | Dist: ");
  
  // Check if the reading is within the reliable range of the sensor (4cm - 30cm)
  // Note: Readings can be erratic outside this range.
  if (outDistance >= 4 && outDistance <= 30 ) {
    Serial.print(outDistance);
    Serial.println(" cm");
    
    // Trigger alert if distance is close to minimum (e.g. <= 10cm)
    if (outDistance <= 5) {
      digitalWrite(alertPin, LOW);
      Serial.println("Turning Servo");
      delay(3600);
      digitalWrite(alertPin, HIGH);
      
    }
  else {
    Serial.println("Out Range");
  }
  
  // Wait a bit before the next loop
  delay(100);
}
}