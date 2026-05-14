"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropModalProps {
  imageSrc: string;
  onCropDone: (croppedFile: File) => void;
  onCancel: () => void;
}

export function ImageCropModal({ imageSrc, onCropDone, onCancel }: ImageCropModalProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>({ unit: "%", x: 10, y: 10, width: 80, height: 80 });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);

  const getCroppedFile = useCallback(async () => {
    const image = imgRef.current;
    if (!image || !completedCrop) return;

    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `cropped-${Date.now()}.webp`, { type: "image/webp" });
        onCropDone(file);
      }
    }, "image/webp", 0.9);
  }, [completedCrop, onCropDone]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border-subtle bg-surface-elevated p-4 space-y-4">
        <h3 className="text-lg font-bold text-warm-white">Crop Gambar</h3>
        <div className="max-h-[60vh] overflow-auto flex justify-center">
          <ReactCrop crop={crop} onChange={setCrop} onComplete={setCompletedCrop} aspect={3 / 4}>
            <img ref={imgRef} src={imageSrc} alt="Crop" className="max-w-full" />
          </ReactCrop>
        </div>
        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-border-subtle text-sm text-warm-white/70 hover:bg-warm-white/10">
            Batal
          </button>
          <button type="button" onClick={getCroppedFile} className="px-4 py-2 rounded-lg bg-warm-white text-ink-black text-sm font-semibold hover:bg-white">
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}
