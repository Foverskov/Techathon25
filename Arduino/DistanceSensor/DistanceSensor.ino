/*
  Sharp 2Y0A02 Distance Sensor
  
  Reads an analog input from the Sharp GP2Y0A02YK0F distance sensor,
  converts it to distance in cm.
  
  The circuit:
   * Alert Pin to digital pin 2
   * Sharp Sensor Vo to Analog pin A0
   * Sharp Sensor Vcc to 5V
   * Sharp Sensor GND to GND
*/

const int sensorPin = A0;
const int alertPin = 2;

void setup() {
  pinMode(alertPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // Read the analog value from the sensor (0 - 1023)
  int sensorValue = analogRead(sensorPin);
  
  // Convert the analog value (0-1023) to voltage (0-5V)
  float volts = sensorValue * (5.0 / 1023.0);
  
  // Calculate distance in cm for GP2Y0A02YK0F (20-150cm range)
  // The relationship between voltage and distance is non-linear.
  // A common power regression formula for this sensor is:
  // Distance = 60.495 * Voltage^-1.1904
  float distance = 60.495 * pow(volts, -1.1904);

  Serial.print("Raw: ");
  Serial.print(sensorValue);
  Serial.print(" | Dist: ");
  
  // Check if the reading is within the reliable range of the sensor (20cm - 150cm)
  // Note: Readings can be erratic outside this range.
  if (distance >= 20 && distance <= 150) {
    Serial.print(distance);
    Serial.println(" cm");
    
    // Trigger alert if distance is close to minimum (e.g. <= 25cm)
    if (distance <= 25) {
      digitalWrite(alertPin, HIGH);
    } else {
      digitalWrite(alertPin, LOW);
    }
  } else {
    Serial.println("Out Range");
    digitalWrite(alertPin, LOW);
  }
  
  // Wait a bit before the next loop
  delay(500);
}
