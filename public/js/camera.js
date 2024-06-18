const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const video = $('<video>', {
    width: isMobile ? 320 : 600,
    height: isMobile ? 240 : 400,
    'max-width': '100%',
    'max-height': '100%',
    autoplay: true
});

const generateIngredientsForm = $('#generate-ingredients-form');
const cameraView = $('#camera')
const captureButton = $('#captureButton');
const capturedImage = $('#capturedImage');
const recaptureBtn  = $('#recaptureBtn');
const commenceIdentifyingIngredientsBtn = $('#commenceIdentifyingIngredientsBtn');
const ingredientsImageBase64Input = $('#ingredients-image-base64');

let stream;

cameraView.append(video);
startCamera();

$(document).ready(function() { 
    // Hide message after 5s or click captureButton
    setTimeout(function() {
        $('.alert').alert('close');
    }, 5000);
    $('#captureButton').click(function() {
        $('.alert').alert('close');
    });

    // Show loading spinner on form submission
    generateIngredientsForm.submit(function() {
        $('#loading-overlay').removeClass('d-none');
        commenceIdentifyingIngredientsBtn.prop('disabled', true);
    });

    captureButton.on('click', function () {
        const canvas = document.createElement('canvas');
        canvas.width = video[0].videoWidth;
        canvas.height = video[0].videoHeight;
        canvas.getContext('2d').drawImage(video[0],0, 0, canvas.width, canvas.height);
    
        const imageDataURL = canvas.toDataURL('image/png');
    
        capturedImage.attr('src', imageDataURL).show();
        video.hide();
        captureButton.hide();
        stream.getTracks().forEach(track => track.stop());
        recaptureBtn.removeClass("d-none");
        commenceIdentifyingIngredientsBtn.removeClass("d-none");
    
        // Set the image base 64 to the input
        ingredientsImageBase64Input.val(imageDataURL);
    })
    
    recaptureBtn.on('click', resetCamera);
});

function startCamera() {
    let constraints = { video: true };
    if (isMobile) {
        constraints = { video: { facingMode: 'environment' } };
    }
    
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (mediaStream) {
            stream = mediaStream;
            video[0].srcObject = mediaStream;
            video[0].play();
        })
        .catch(function (err) {
            console.error('Error accessing camera:', err);
        });
}

function resetCamera() {
    recaptureBtn.addClass("d-none");
    commenceIdentifyingIngredientsBtn.addClass("d-none");
    capturedImage.hide();
    video.show();
    captureButton.show();
    capturedImage.attr('src', '');
    startCamera();
}