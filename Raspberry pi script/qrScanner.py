import cv2
import numpy as np

class QRScanner:
    def __init__(self):
        # Initialize the built-in OpenCV QR Code detector
        self.detector = cv2.QRCodeDetector()

    def process_frame(self, frame):
        """
        Scans a frame for QR codes, draws a box around them, and returns the decoded data.
        
        Args:
            frame: The video frame (numpy array).
            
        Returns:
            processed_frame: The frame with graphics overlay.
            decoded_data: The string content of the QR code (or None if nothing found).
        """
        try:
            # detectAndDecode returns: data, points, straight_qrcode
            data, points, _ = self.detector.detectAndDecode(frame)
            
            if data:
                # If a QR code was found
                if points is not None:
                    # Convert points to integer for drawing
                    points = points.astype(int)
                    
                    # Handle different shape outputs from different OpenCV versions
                    # Sometimes it's (1, 4, 2), sometimes (4, 2)
                    if len(points.shape) == 3:
                        points = points[0]
                    
                    # Draw the bounding box polygon
                    for i in range(len(points)):
                        pt1 = tuple(points[i])
                        pt2 = tuple(points[(i+1) % len(points)])
                        cv2.line(frame, pt1, pt2, (0, 255, 0), 3)
                    
                    # Draw the text above the box
                    if len(points) > 0:
                        cv2.putText(frame, data, (points[0][0], points[0][1] - 10),
                                  cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
                
                return frame, data
                
        except Exception as e:
            print(f"QR Scan Error: {e}")
            
        return frame, None
