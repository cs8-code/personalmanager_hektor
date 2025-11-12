interface HektorLogoProps {
  className?: string;
  textClassName?: string;
  showText?: boolean;
}

export default function HektorLogo({ className = "w-12 h-12", textClassName = "text-2xl", showText = true }: HektorLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <svg
        viewBox="0 0 100 100"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#1e3a8a', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <path
          d="M 20 15 L 85 50 L 20 85 Z"
          fill="url(#triangleGradient)"
          style={{
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
          }}
        />
      </svg>
      {showText && (
        <div className="flex flex-col">
          <span className={`${textClassName} font-bold text-gray-900 leading-tight`}>
            PERSONALMANAGER
          </span>
          <span className={`${textClassName} font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent leading-tight`}>
            HEKTOR
          </span>
        </div>
      )}
    </div>
  );
}
