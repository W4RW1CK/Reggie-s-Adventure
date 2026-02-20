'use client';

import { useRef, useCallback } from 'react';

interface ChatPhotoPickerProps {
  onCapture: (base64: string) => void;
  onClose: () => void;
}

export default function ChatPhotoPicker({ onCapture, onClose }: ChatPhotoPickerProps) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      onCapture(base64);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [onCapture]);

  return (
    <div className="chat-photo-picker">
      <div className="chat-photo-picker__overlay" onClick={onClose} />
      <div className="chat-photo-picker__menu">
        <button
          className="chat-photo-picker__option"
          onClick={() => cameraRef.current?.click()}
        >
          📸 Cámara
        </button>
        <button
          className="chat-photo-picker__option"
          onClick={() => galleryRef.current?.click()}
        >
          🖼️ Galería
        </button>
        <button
          className="chat-photo-picker__close"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: 'none' }} aria-hidden="true" />
      <input ref={galleryRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} aria-hidden="true" />
    </div>
  );
}
