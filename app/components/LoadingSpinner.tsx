"use client";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  label, 
  fullScreen = false,
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  const spinner = (
    <div className={`relative ${fullScreen ? 'h-full w-full flex items-center justify-center' : ''} ${className}`}>
      <div className="flex flex-col items-center justify-center gap-3">
        <div 
          className={`animate-spin rounded-full border-t-transparent border-primary ${sizeClasses[size]}`}
          role="status"
          aria-label={label || "Loading"}
        />
        {label && (
          <p className="text-sm text-text-secondary font-medium">{label}</p>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}
