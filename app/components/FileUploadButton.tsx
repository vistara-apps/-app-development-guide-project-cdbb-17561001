"use client";

import { useRef, useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface FileUploadButtonProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
  acceptedFileTypes?: string[];
  maxFileSizeMB?: number;
}

export function FileUploadButton({ 
  onFileUpload, 
  isProcessing, 
  acceptedFileTypes = [".pdf", "image/*"],
  maxFileSizeMB = 10
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateFile = (file: File): boolean => {
    // Check file type
    const fileType = file.type;
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    
    const isValidType = acceptedFileTypes.some(type => {
      if (type.startsWith('.')) {
        return fileExtension === type.toLowerCase();
      } else if (type.endsWith('/*')) {
        const category = type.split('/')[0];
        return fileType.startsWith(`${category}/`);
      } else {
        return fileType === type;
      }
    });

    if (!isValidType) {
      setError(`Invalid file type. Please upload ${acceptedFileTypes.join(', ')}`);
      return false;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSizeMB) {
      setError(`File size exceeds ${maxFileSizeMB}MB limit`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (file && validateFile(file)) {
      setSelectedFile(file);
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

  const resetFileSelection = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          error 
            ? "border-error bg-error/5" 
            : dragActive 
              ? "border-primary bg-primary/5 shadow-md" 
              : "border-gray-300 hover:border-primary hover:bg-primary/5"
        } ${isProcessing ? "opacity-80 cursor-not-allowed" : "cursor-pointer"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        aria-label="Upload file area"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            !isProcessing && fileInputRef.current?.click();
          }
        }}
      >
        <input
          id="file-upload"
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes.join(',')}
          onChange={handleInputChange}
          className="hidden"
          disabled={isProcessing}
          aria-hidden="true"
        />
        
        <div className="space-y-4">
          {isProcessing ? (
            <div className="animate-fade-in">
              <LoadingSpinner size="md" label="Processing your statement..." />
            </div>
          ) : (
            <>
              <div className={`w-16 h-16 rounded-lg mx-auto flex items-center justify-center transition-all ${
                error ? "bg-error/10" : "bg-primary/10"
              }`}>
                {selectedFile && !error ? (
                  <div className="flex flex-col items-center">
                    <svg 
                      className="w-8 h-8 text-primary" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                  </div>
                ) : error ? (
                  <svg 
                    className="w-8 h-8 text-error" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                ) : (
                  <svg 
                    className="w-8 h-8 text-primary" 
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
                )}
              </div>
              
              <div>
                <p className={`heading mb-2 ${error ? "text-error" : "text-primary"}`}>
                  {error ? "Upload Error" : selectedFile ? "File Selected" : "Upload Statement"}
                </p>
                
                {error ? (
                  <p className="body text-error">{error}</p>
                ) : selectedFile ? (
                  <div className="space-y-2">
                    <p className="body font-medium">{selectedFile.name}</p>
                    <p className="body-sm text-text-secondary">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        resetFileSelection();
                      }}
                      className="btn-secondary mt-2"
                    >
                      Choose Different File
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="body text-text-secondary">
                      Drop your bank statement here or click to browse
                    </p>
                    <p className="body-sm text-text-tertiary mt-2">
                      Supports {acceptedFileTypes.join(', ')} (Max: {maxFileSizeMB}MB)
                    </p>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      {error && (
        <div className="flex justify-end">
          <button 
            onClick={resetFileSelection}
            className="text-sm text-primary font-medium hover:text-primary/80 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
