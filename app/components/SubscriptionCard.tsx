
"use client";

interface SubscriptionCardProps {
  isProUser: boolean;
  onUpgrade: () => void;
}

export function SubscriptionCard({ isProUser, onUpgrade }: SubscriptionCardProps) {
  const features = [
    { name: "Unlimited statement uploads", free: false, pro: true },
    { name: "Basic spending analysis", free: true, pro: true },
    { name: "Advanced insights & recommendations", free: false, pro: true },
    { name: "Priority processing", free: false, pro: true },
    { name: "Export financial reports", free: false, pro: true },
    { name: "Email notifications", free: false, pro: true },
  ];

  if (isProUser) {
    return (
      <div className="card border-2 border-accent">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-accent/10 rounded-full mx-auto flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="display text-accent mb-2">You're a Pro User!</h2>
          <p className="body text-gray-600">
            Enjoy unlimited access to all StatementSage features.
          </p>
        </div>

        <div className="space-y-3">
          {features.filter(feature => feature.pro).map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="body">{feature.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="card">
        <h2 className="heading mb-4">Current Plan: Free</h2>
        <div className="space-y-3">
          {features.filter(feature => feature.free).map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="body">{feature.name}</span>
            </div>
          ))}
          
          {features.filter(feature => !feature.free).map((feature, index) => (
            <div key={index} className="flex items-center gap-3 opacity-50">
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
              <span className="body text-gray-500">{feature.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Plan */}
      <div className="card border-2 border-accent">
        <div className="flex items-center justify-between mb-4">
          <h2 className="heading text-accent">Pro Plan</h2>
          <div className="text-right">
            <p className="display text-accent">$5</p>
            <p className="text-sm text-gray-600">per month</p>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="body">{feature.name}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onUpgrade}
          className="btn-accent w-full"
        >
          Upgrade to Pro
        </button>
        
        <p className="text-xs text-gray-500 text-center mt-3">
          Cancel anytime. No hidden fees.
        </p>
      </div>
    </div>
  );
}
