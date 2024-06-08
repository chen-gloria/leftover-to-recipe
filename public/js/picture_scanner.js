const video = document.createElement('video');
const cameraView = document.getElementById('camera');
const captureButton = document.getElementById('captureButton');
const capturedImage = document.getElementById('capturedImage');
const recaptureBtn  = document.getElementById('recaptureBtn');
const commenceIdentifyingIngredientsBtn = document.getElementById('commenceIdentifyingIngredientsBtn');
const ingredientsImageBase64Input = document.getElementById('ingredients-image-base64');

let stream;

function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (mediaStream) {
            stream = mediaStream;
            video.srcObject = mediaStream;
            cameraView.appendChild(video);
            video.play();
        })
        .catch(function (err) {
            console.error('Error accessing camera:', err);
        });
}

function resetCamera() {
    recaptureBtn.classList.add("d-none");
    commenceIdentifyingIngredientsBtn.classList.add("d-none");
    capturedImage.style.display = 'none';
    video.style.display = 'block';
    captureButton.style.display = 'block';
    capturedImage.src = '';
    startCamera();
}

startCamera();

captureButton.addEventListener('click', function () {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    capturedImage.src = canvas.toDataURL('image/png');
    capturedImage.style.display = 'block';
    video.style.display = 'none';
    captureButton.style.display = 'none';
    stream.getTracks().forEach(track => track.stop());
    recaptureBtn.classList.remove("d-none");
    commenceIdentifyingIngredientsBtn.classList.remove("d-none");
    // Set the image base 64 to the input
    ingredientsImageBase64Input.value = canvas.toDataURL('image/png');
});

recaptureBtn.addEventListener('click', resetCamera);