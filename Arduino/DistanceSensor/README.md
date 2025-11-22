# Sharp 2Y0A02 Distance Sensor

This Arduino sketch reads distance data from a Sharp GP2Y0A02YK0F IR distance sensor (20-150cm) and prints it to the Serial Monitor.

## Components Required

*   Arduino Board (Uno, Nano, etc.)
*   Sharp GP2Y0A02YK0F Distance Sensor
*   Jumper wires
*   Breadboard

## Wiring

### Alert Output

*   **Pin 2**: Goes HIGH (5V) when the distance is ≤ 25cm. Connect an LED (with resistor) or buzzer here.

### Sharp 2Y0A02 Sensor

| Sensor Wire | Function | Arduino Pin |
| :--- | :--- | :--- |
| Red | VCC | 5V |
| Black | GND | GND |
| Yellow/White | Signal (Vo) | Analog A0 |

## Code Explanation

The code reads the analog voltage from pin A0. Since the output of the Sharp sensor is non-linear, we use a power regression formula to convert the voltage into centimeters:

$$ \text{Distance (cm)} = 60.495 \times \text{Voltage}^{-1.1904} $$

This formula is specific to the **GP2Y0A02YK0F** (20-150cm) sensor. If you are using a different Sharp sensor (like the 10-80cm GP2Y0A21YK0F), you will need to adjust the formula.

### Serial Monitor

Open the Serial Monitor in the Arduino IDE (Tools > Serial Monitor) and set the baud rate to **9600** to see the distance readings.
