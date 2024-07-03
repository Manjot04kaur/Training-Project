import cv2

def capture_selfie_and_crop_faces():
    # Load the Haar cascade file for face detection
    haar_cascade_path = 'haarcascade_frontalface_default.xml'
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + haar_cascade_path)

    # Open the webcam
    video_capture = cv2.VideoCapture(0)

    if not video_capture.isOpened():
        print("Could not open webcam")
        return

    print("Press 's' to capture a selfie")

    while True:
        # Capture frame-by-frame
        ret, frame = video_capture.read()

        if not ret:
            print("Failed to capture image")
            break

        # Display the resulting frame
        cv2.imshow('Video', frame)

        # Wait for user to press 's' to save the selfie
        if cv2.waitKey(1) & 0xFF == ord('s'):
            # Save the frame as a JPEG file
            selfie_filename = 'selfie.jpg'
            cv2.imwrite(selfie_filename, frame)
            print(f"Selfie saved as {selfie_filename}")
            break

    # When everything is done, release the capture
    video_capture.release()
    cv2.destroyAllWindows()

    # Load the saved selfie
    image = cv2.imread(selfie_filename)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Detect faces in the image
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30), flags=cv2.CASCADE_SCALE_IMAGE)

    if len(faces) == 0:
        print("No faces detected in the image")
        return

    # Loop through all detected faces and save each cropped face image
    for i, (x, y, w, h) in enumerate(faces):
        # Crop the face from the image
        face_image = image[y:y+h, x:x+w]

        # Save the cropped face image
        cropped_face_filename = f'cropped_face_{i+1}.jpg'
        cv2.imwrite(cropped_face_filename, face_image)
        print(f"Cropped face {i+1} saved as {cropped_face_filename}")

if __name__ == '__main__':
    capture_selfie_and_crop_faces()
