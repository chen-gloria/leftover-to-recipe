import { useEffect, useRef, useState } from 'react';
import FlashMessage from '../components/FlashMessage.jsx';
import Icon from '../components/Icon.jsx';
import '../camera.css';

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export default function Camera({
  personAllergies,
  personPreferences,
  onChangeAllergies,
  onChangePreferences,
  onBack,
  onSubmit,
  isSubmitting,
  errorMessage,
  onDismissError
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startCamera() {
    const constraints = isMobile ? { video: { facingMode: 'environment' } } : { video: true };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((mediaStream) => {
        streamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      })
      .catch((err) => {
        console.error('Error accessing camera:', err);
      });
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  function handleCapture() {
    if (!streamRef.current || !videoRef.current) {
      console.error('Camera stream not initialized.');
      return;
    }

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/png');
    setCapturedImage(imageDataUrl);
    stopCamera();
  }

  function handleRecapture() {
    setCapturedImage(null);
    startCamera();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (capturedImage) {
      onSubmit(capturedImage);
    }
  }

  return (
    <>
      <FlashMessage type="danger" message={errorMessage} onDismiss={onDismissError} />

      <button type="button" className="link-back" onClick={onBack}>
        <Icon name="arrowLeft" size={16} /> Back to preferences
      </button>

      <h2 style={{ marginTop: 'var(--space-4)' }}>Snap your ingredients</h2>
      <p className="profile-meta" style={{ marginBottom: 'var(--space-4)' }}>
        A photo of your fridge, pantry, or a grocery receipt all work.
      </p>

      <form onSubmit={handleSubmit} className="stack" style={{ gap: 'var(--space-5)' }}>
        <div className="pref-fields">
          <label className="pref-field">
            <span className="pref-field-label">Preferences</span>
            <input
              type="text"
              autoComplete="off"
              value={personPreferences}
              onChange={(e) => onChangePreferences(e.target.value)}
            />
          </label>
          <label className="pref-field">
            <span className="pref-field-label">Allergies</span>
            <input
              type="text"
              autoComplete="off"
              value={personAllergies}
              onChange={(e) => onChangeAllergies(e.target.value)}
            />
          </label>
        </div>

        <div className="capture-frame">
          <video
            ref={videoRef}
            style={{ display: capturedImage ? 'none' : 'block' }}
            autoPlay
            muted
            playsInline
          />
          {!capturedImage && <div className="frame-hint" />}
          {capturedImage && <img alt="Captured" src={capturedImage} />}
        </div>

        <div className="cta-group">
          {!capturedImage && (
            <button type="button" className="btn btn-primary btn-block" onClick={handleCapture}>
              <Icon name="camera" size={17} /> Capture
            </button>
          )}
          {capturedImage && (
            <button type="button" className="btn btn-outline btn-block" onClick={handleRecapture}>
              Retake photo
            </button>
          )}
          {capturedImage && (
            <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
              Identify ingredients
            </button>
          )}
        </div>
      </form>

      {isSubmitting && (
        <div id="loading-overlay">
          <div className="spinner" role="status" aria-label="Loading" />
        </div>
      )}
    </>
  );
}
