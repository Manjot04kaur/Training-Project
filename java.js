document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById('videoFeed');
    const canvas = document.getElementById('canvas');
    const captureButton = document.getElementById('captureButton');
    const saveSelfieButton = document.getElementById('saveSelfieButton');
    const saveFacesButton = document.getElementById('saveFacesButton');

    let stream;
    let selfieDataUrl;

    // Get user media (webcam) and stream video
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (streamObj) {
            stream = streamObj;
            video.srcObject = stream;
        })
        .catch(function (error) {
            console.log("Error accessing webcam:", error);
        });

    // Event listener for capture button
    captureButton.addEventListener('click', function () {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        selfieDataUrl = canvas.toDataURL('image/jpeg');
        saveSelfieButton.style.display = 'inline-block';
    });

    // Event listener for save selfie button
    saveSelfieButton.addEventListener('click', function () {
        fetch(selfieDataUrl)
            .then(res => res.blob())
            .then(blob => {
                const formData = new FormData();
                formData.append('selfie', blob);

                // Send the selfie to the server-side script (Python function)
                fetch('/save-selfie', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.text())
                    .then(data => {
                        console.log(data);
                        saveFacesButton.style.display = 'inline-block';
                    })
                    .catch(error => {
                        console.error('Error saving selfie:', error);
                    });
            });
    });

    // Event listener for save faces button
    saveFacesButton.addEventListener('click', function () {
        // Send request to server to process the saved selfie and crop faces
        fetch('/crop-faces')
            .then(response => response.text())
            .then(data => {
                console.log(data);
                alert('Cropped faces saved successfully!');
            })
            .catch(error => {
                console.error('Error cropping faces:', error);
            });
    });

    // Stop video stream when the user leaves the page
    window.addEventListener('beforeunload', function () {
        if (stream) {
            stream.getTracks().forEach(track => {
                track.stop();
            });
        }
    });
});
