const spinnerDiv = `
    <div class="spinner-border"
        role="status"
        style="position:absolute;"
    >
    </div>
`;

const cameraAccessDeniedParagraph = `
    <div class="card alert-card border-alert-error border-callout-left rounded-0 py-4 pl-2">
        <div class="row">
            <div class="col">
                <span class="p-2">
                    Access to camera required to take photos.
                    </br>
                    Please grant access to camera for the browser. 
                </span>
            </div>
        </div>
    </div>
`;

$(document).ready(function () {
    const pictureScannerContainer = $("#picture-scanner-container");

    pictureScannerContainer.prepend(spinnerDiv);

    try {
        window['BarcodeDetector'].getSupportedFormats()
    } catch {
        window['BarcodeDetector'] = barcodeDetectorPolyfill.BarcodeDetectorPolyfill
    }
      
    (async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: {
                ideal: "environment"
                }
            },
            audio: false
        });
 
        const videoEl = document.querySelector("#picture-scanner");
        videoEl.srcObject = stream;
        await videoEl.play();
        
        $("#picture-scanner-container").find('div.spinner-border').remove();
        
        const barcodeDetector = new BarcodeDetector({formats: ['qr_code']});
        
        const qrScannerForm = document.querySelector('#picture-scanner-form');
        const qrScannerInput = document.querySelector('#picture-scanner-input');

        const barcodeScanInterval = window.setInterval(async () => {
            const barcodes = await barcodeDetector.detect(videoEl);
            if (barcodes.length <= 0) return;
              
            const customerId = barcodes[0].rawValue;
            qrScannerInput.setAttribute('value', customerId);

            qrScannerForm.submit();
            window.clearInterval(barcodeScanInterval);
        }, 100)
    })();

    navigator.permissions.query({ name: "camera" }).then(res => {
        if (res.state !== "granted") {
            qrScannerContainer.find('div.spinner-border').remove();
            qrScannerContainer.append(cameraAccessDeniedParagraph);
        }
    });
});