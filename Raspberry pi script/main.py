import cv2
import socket
import struct
import argparse
import numpy as np
import sys
from Raspberry pi script.qrScanner import QRScanner

def run_server(host='0.0.0.0', port=8000):
    """
    Runs the video streaming server (run this on Raspberry Pi)
    """
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # Allow reuse of address to avoid "Address already in use" errors
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    
    try:
        server_socket.bind((host, port))
        server_socket.listen(1)
        print(f"Server listening on {host}:{port}")
        print("Waiting for connection...")

        client_socket, addr = server_socket.accept()
        print(f"Connection established with {addr}")

        # Initialize camera
        cap = cv2.VideoCapture(0)
        
        # Set resolution (lower resolution = faster stream)
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

        if not cap.isOpened():
            print("Error: Could not open camera.")
            return

        while True:
            ret, frame = cap.read()
            if not ret:
                print("Error: Can't receive frame (stream end?). Exiting ...")
                break
            
            # Compress frame to JPEG to reduce bandwidth
            # Quality 0-100 (higher is better quality but more data)
            encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 70]
            result, frame_encoded = cv2.imencode('.jpg', frame, encode_param)
            
            if not result:
                continue
                
            data = np.array(frame_encoded)
            stringData = data.tobytes()
            
            # Send message length first (unsigned long long = 8 bytes)
            # This tells the client how much data to expect for this frame
            try:
                client_socket.sendall(struct.pack(">L", len(stringData)) + stringData)
            except (ConnectionResetError, BrokenPipeError):
                print("Connection lost.")
                break
                
    except KeyboardInterrupt:
        print("\nStopping server...")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if 'client_socket' in locals():
            client_socket.close()
        server_socket.close()
        if 'cap' in locals():
            cap.release()

def run_client(server_ip, port=8000):
    """
    Runs the video receiving client (run this on MacBook)
    """
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    
    try:
        print(f"Connecting to {server_ip}:{port}...")
        client_socket.connect((server_ip, port))
        print("Connected!")

        # Initialize QR Scanner
        scanner = QRScanner()

        data = b""
        # 'L' is unsigned long (4 bytes) in standard size, but let's match server pack format
        # struct.calcsize(">L") is 4 bytes.
        payload_size = struct.calcsize(">L")

        while True:
            # Retrieve message size
            while len(data) < payload_size:
                packet = client_socket.recv(4096)
                if not packet:
                    print("Disconnected from server.")
                    return
                data += packet

            packed_msg_size = data[:payload_size]
            data = data[payload_size:]
            msg_size = struct.unpack(">L", packed_msg_size)[0]

            # Retrieve all data based on message size
            while len(data) < msg_size:
                data += client_socket.recv(4096)

            frame_data = data[:msg_size]
            data = data[msg_size:]

            # Decode and display
            frame = cv2.imdecode(np.frombuffer(frame_data, dtype=np.uint8), cv2.IMREAD_COLOR)
            
            if frame is not None:
                # Scan for QR codes
                frame, qr_data = scanner.process_frame(frame)
                if qr_data:
                    print(f"QR Code Detected: {qr_data}")

                cv2.imshow('Raspberry Pi Video Feed', frame)
                
                # Press 'q' to quit
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
            else:
                print("Error decoding frame")

    except ConnectionRefusedError:
        print(f"Could not connect to {server_ip}:{port}. Is the server running?")
    except KeyboardInterrupt:
        print("\nStopping client...")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client_socket.close()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Video Streaming Script")
    subparsers = parser.add_subparsers(dest='mode', help='Mode to run: server or client')

    # Server parser
    server_parser = subparsers.add_parser('server', help='Run as server (Sender/Pi)')
    server_parser.add_argument('--port', type=int, default=8000, help='Port to listen on')

    # Client parser
    client_parser = subparsers.add_parser('client', help='Run as client (Receiver/Mac)')
    client_parser.add_argument('ip', type=str, help='IP address of the server')
    client_parser.add_argument('--port', type=int, default=8000, help='Port to connect to')

    args = parser.parse_args()

    if args.mode == 'server':
        run_server(port=args.port)
    elif args.mode == 'client':
        run_client(args.ip, port=args.port)
    else:
        parser.print_help()
