
"use client";

import { FinancialInsight } from '../types';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Info, DollarSign } from 'lucide-react';

interface InsightCardProps {
  insight: FinancialInsight;
  variant?: 'recommendation';
}

export function InsightCard({ insight, variant = 'recommendation' }: InsightCardProps) {
  const getIcon = () => {
    switch (insight.type) {
      case 'recommendation':
        return <TrendingUp className="h-5 w-5 text-accent" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-primary" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const getBorderColor = () => {
    switch (insight.type) {
      case 'recommendation':
        return 'border-accent/20';
      case 'warning':
        return 'border-yellow-200';
      case 'info':
        return 'border-primary/20';
      default:
        return 'border-border';
    }
  };

  const getBackgroundColor = () => {
    switch (insight.type) {
      case 'recommendation':
        return 'bg-accent/5';
      case 'warning':
        return 'bg-yellow-50';
      case 'info':
        return 'bg-primary/5';
      default:
        return 'bg-surface';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`card ${getBorderColor()} ${getBackgroundColor()}`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-heading mb-1">{insight.title}</h3>
          <p className="text-body text-muted mb-3">{insight.description}</p>
          
          {insight.amount && (
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-accent" />
              <span className="text-body font-medium text-accent">
                ${insight.amount.toFixed(2)}
                {insight.category && ` in ${insight.category}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
