type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  fullScreen?: boolean;
};

export const LoadingSpinner = ({ 
  size = "md", 
  className = "",
  fullScreen = false 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg
        className={`animate-spin text-primary ${sizeClasses[size]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        {/* Outer ring with gradient */}
        <defs>
          <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
        
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="url(#spinner-gradient)"
          strokeWidth="4"
        />
        
        {/* Animated path with gradient */}
        <path
          className="opacity-75"
          fill="url(#spinner-gradient)"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};