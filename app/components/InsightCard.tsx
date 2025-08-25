"use client";

import { ReactNode } from "react";

interface InsightCardProps {
  title: string;
  content: string;
  type: "recommendation" | "warning" | "info" | "error" | "success";
  actionLabel?: string;
  onAction?: () => void;
  loading?: boolean;
  error?: boolean;
  children?: ReactNode;
}

export function InsightCard({ 
  title, 
  content, 
  type, 
  actionLabel, 
  onAction,
  loading = false,
  error = false,
  children
}: InsightCardProps) {
  const getCardStyles = () => {
    if (error) return "border-error bg-error/5";
    if (loading) return "border-gray-200 bg-gray-50";
    
    switch (type) {
      case "recommendation":
        return "border-accent bg-accent/5";
      case "warning":
        return "border-warning bg-warning/5";
      case "info":
        return "border-primary bg-primary/5";
      case "error":
        return "border-error bg-error/5";
      case "success":
        return "border-success bg-success/5";
      default:
        return "border-gray-200 bg-surface";
    }
  };

  const getIconStyles = () => {
    if (error) return "text-error";
    if (loading) return "text-text-secondary";
    
    switch (type) {
      case "recommendation":
        return "text-accent";
      case "warning":
        return "text-warning";
      case "info":
        return "text-primary";
      case "error":
        return "text-error";
      case "success":
        return "text-success";
      default:
        return "text-text-secondary";
    }
  };

  const getIcon = () => {
    if (error) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    
    if (loading) {
      return (
        <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
      );
    }
    
    switch (type) {
      case "recommendation":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case "warning":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case "info":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "error":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "success":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div 
      className={`card border-2 ${getCardStyles()} animate-fade-in transition-all`}
      role={type === "error" || type === "warning" ? "alert" : "region"}
      aria-labelledby={`insight-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${getIconStyles()}`}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <h3 
            id={`insight-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="heading mb-2"
          >
            {title}
          </h3>
          <p className="body text-text-secondary mb-3">{content}</p>
          
          {children}
          
          {actionLabel && onAction && (
            <button 
              onClick={onAction}
              className={`mt-2 text-sm font-medium ${
                type === "recommendation" ? "text-accent hover:text-accent/80" :
                type === "warning" ? "text-warning hover:text-warning/80" :
                type === "info" ? "text-primary hover:text-primary/80" :
                type === "error" ? "text-error hover:text-error/80" :
                type === "success" ? "text-success hover:text-success/80" :
                "text-primary hover:text-primary/80"
              } transition-colors`}
              disabled={loading}
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function EmptyStateCard({ 
  title, 
  description, 
  actionLabel, 
  onAction,
  icon
}: { 
  title: string; 
  description: string; 
  actionLabel?: string; 
  onAction?: () => void;
  icon?: ReactNode;
}) {
  return (
    <div className="card border border-gray-200 py-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        {icon ? (
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            {icon}
          </div>
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-text-secondary" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
              />
            </svg>
          </div>
        )}
        <div>
          <h2 className="heading mb-2">{title}</h2>
          <p className="body text-text-secondary mb-6 max-w-md mx-auto">
            {description}
          </p>
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="btn-primary"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ErrorStateCard({ 
  title = "Something went wrong", 
  description = "We encountered an error while processing your request. Please try again.",
  actionLabel = "Try Again",
  onAction
}: { 
  title?: string; 
  description?: string; 
  actionLabel?: string; 
  onAction?: () => void;
}) {
  return (
    <div className="card border-2 border-error bg-error/5 py-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
          <svg 
            className="w-6 h-6 text-error" 
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
        </div>
        <div>
          <h2 className="heading mb-2">{title}</h2>
          <p className="body text-text-secondary mb-4 max-w-md mx-auto">
            {description}
          </p>
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="btn-primary bg-error hover:bg-error/90"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
