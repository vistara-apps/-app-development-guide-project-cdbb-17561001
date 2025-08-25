
"use client";

import { useRef, useState } from "react";

interface FileUploadButtonProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
}

export function FileUploadButton({ onFileUpload, isProcessing }: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && (file.type === "application/pdf" || file.type.startsWith("image/"))) {
      onFileUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragActive 
          ? "border-primary bg-primary/5" 
          : "border-gray-300 hover:border-primary hover:bg-primary/5"
      } ${isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => !isProcessing && fileInputRef.current?.click()}
    >
      <input
        id="file-upload"
        ref={fileInputRef}
        type="file"
        accept=".pdf,image/*"
        onChange={handleInputChange}
        className="hidden"
        disabled={isProcessing}
      />
      
      <div className="space-y-4">
        <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto flex items-center justify-center">
          <svg 
            className="w-6 h-6 text-primary" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
        </div>
        
        <div>
          <p className="heading text-primary mb-2">
            {isProcessing ? "Processing..." : "Upload Statement"}
          </p>
          <p className="body text-gray-600">
            Drop your bank statement here or click to browse
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Supports PDF and image files
          </p>
        </div>
      </div>
    </div>
  );
}
