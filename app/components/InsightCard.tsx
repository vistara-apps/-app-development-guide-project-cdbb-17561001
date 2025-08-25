
"use client";

interface InsightCardProps {
  title: string;
  content: string;
  type: "recommendation" | "warning" | "info";
}

export function InsightCard({ title, content, type }: InsightCardProps) {
  const getCardStyles = () => {
    switch (type) {
      case "recommendation":
        return "border-accent bg-accent/5";
      case "warning":
        return "border-yellow-400 bg-yellow-50";
      case "info":
        return "border-blue-400 bg-blue-50";
      default:
        return "border-gray-200 bg-surface";
    }
  };

  const getIconStyles = () => {
    switch (type) {
      case "recommendation":
        return "text-accent";
      case "warning":
        return "text-yellow-600";
      case "info":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getIcon = () => {
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
    }
  };

  return (
    <div className={`card border-2 ${getCardStyles()} animate-slide-up`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${getIconStyles()}`}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <h3 className="heading mb-2">{title}</h3>
          <p className="body text-gray-700">{content}</p>
        </div>
      </div>
    </div>
  );
}
