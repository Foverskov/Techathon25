# Techathon25 Video Streamer

A simple Python script to stream video from a Raspberry Pi to a Mac (or any other computer) using TCP sockets and OpenCV.

## Prerequisites

You need to have Python installed on both machines.

### Dependencies

Install the required packages on **both** the Raspberry Pi and your Mac:

```bash
pip install opencv-python numpy
```

## Usage

### 1. On the Raspberry Pi (Server)

Run the script in server mode. This will start capturing video from the camera and waiting for a connection.

```bash
python main.py server
```

*Note: Make sure your Raspberry Pi camera is enabled and connected.*

### 2. On the MacBook (Client)

Run the script in client mode, providing the IP address of your Raspberry Pi.

```bash
python main.py client <RASPBERRY_PI_IP_ADDRESS>
```

Example:
```bash
python main.py client 192.168.1.15
```

### Controls

- Press `q` on the client window to stop the stream and close the application.
