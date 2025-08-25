"use client";

interface SubscriptionCardProps {
  isProUser: boolean;
  onUpgrade: () => void;
}

export function SubscriptionCard({ isProUser, onUpgrade }: SubscriptionCardProps) {
  const features = [
    { id: "feature-uploads", name: "Unlimited statement uploads", free: false, pro: true },
    { id: "feature-basic", name: "Basic spending analysis", free: true, pro: true },
    { id: "feature-advanced", name: "Advanced insights & recommendations", free: false, pro: true },
    { id: "feature-priority", name: "Priority processing", free: false, pro: true },
    { id: "feature-export", name: "Export financial reports", free: false, pro: true },
    { id: "feature-notifications", name: "Email notifications", free: false, pro: true },
  ];

  if (isProUser) {
    return (
      <div className="card border-2 border-accent" aria-labelledby="pro-plan-active-title">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-accent/10 rounded-full mx-auto flex items-center justify-center mb-4" aria-hidden="true">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 id="pro-plan-active-title" className="display text-accent mb-2">You're a Pro User!</h2>
          <p className="body text-text-secondary">
            Enjoy unlimited access to all StatementSage features.
          </p>
        </div>

        <ul className="space-y-3" aria-label="Pro plan features">
          {features.filter(feature => feature.pro).map((feature) => (
            <li key={feature.id} className="flex items-center gap-3">
              <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="body">{feature.name}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <section className="card" aria-labelledby="free-plan-title">
        <h2 id="free-plan-title" className="heading mb-4">Current Plan: Free</h2>
        <ul className="space-y-3" aria-label="Free plan features">
          {features.filter(feature => feature.free).map((feature) => (
            <li key={feature.id} className="flex items-center gap-3">
              <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="body">{feature.name}</span>
            </li>
          ))}
          
          {features.filter(feature => !feature.free).map((feature) => (
            <li key={feature.id} className="flex items-center gap-3 opacity-60">
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0" aria-hidden="true"></div>
              <span className="body text-text-tertiary">{feature.name}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Pro Plan */}
      <section className="card border-2 border-accent" aria-labelledby="pro-plan-title">
        <div className="flex items-center justify-between mb-4">
          <h2 id="pro-plan-title" className="heading text-accent">Pro Plan</h2>
          <div className="text-right">
            <p className="display text-accent">$5</p>
            <p className="text-sm text-text-secondary">per month</p>
          </div>
        </div>
        
        <ul className="space-y-3 mb-6" aria-label="Pro plan features">
          {features.map((feature) => (
            <li key={feature.id} className="flex items-center gap-3">
              <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="body">{feature.name}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={onUpgrade}
          className="btn-accent w-full"
          aria-label="Upgrade to Pro plan for $5 per month"
        >
          Upgrade to Pro
        </button>
        
        <p className="text-xs text-text-tertiary text-center mt-3">
          Cancel anytime. No hidden fees.
        </p>
      </section>
    </div>
  );
}
