import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'option' | 'submit' | 'sleekPrimary' | 'sleekSecondary';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  // Base styles
  const baseStyles = "relative overflow-hidden transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed group";
  
  // Size/Shape styles vary slightly by variant
  const getShapeStyles = () => {
    switch (variant) {
      case 'sleekPrimary':
      case 'sleekSecondary':
        return "h-12 md:h-14 rounded-xl";
      case 'option':
        return "rounded-xl";
      default:
        return "py-3.5 px-8 rounded-xl";
    }
  };

  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-xl shadow-purple-900/20 border border-white/10 bg-[length:200%_auto] animate-shimmer hover:shadow-purple-500/30 active:scale-[0.97]",
    secondary: "bg-slate-900/50 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 hover:text-white backdrop-blur-sm active:scale-[0.97]",
    option: "text-left bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 hover:border-purple-500/50 text-slate-200 p-5 hover:shadow-lg hover:shadow-purple-900/10 active:scale-[0.99]",
    submit: "bg-transparent border border-blue-500/50 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:bg-blue-500/10 active:scale-[0.97]",
    sleekPrimary: "bg-transparent w-full",
    sleekSecondary: "bg-transparent w-full"
  };

  const getVariantClasses = () => variants[variant] || variants.primary;

  // Custom Content Rendering for Sleek Variants
  const renderSleekContent = (isSecondary: boolean) => (
    <>
      <div className={`absolute inset-0 transition-opacity group-hover:opacity-100 ${isSecondary ? 'bg-slate-800/40 opacity-30' : 'bg-gradient-to-r from-blue-900/20 to-purple-900/20 opacity-50'}`}></div>
      <div className={`absolute inset-0 border rounded-xl transition-colors duration-500 ${isSecondary ? 'border-slate-600/30 group-hover:border-slate-400/50' : 'border-blue-500/30 group-hover:border-blue-400/60'}`}></div>
      {!isSecondary && (
        <div className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
      )}
      
      <div className="relative h-full flex items-center justify-between px-6">
        <span className={`font-bold tracking-[0.2em] text-[10px] md:text-sm uppercase transition-colors ${isSecondary ? 'text-slate-400 group-hover:text-white' : 'text-blue-100 group-hover:text-white'}`}>
          {children}
        </span>
        <div className={`flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full border transition-all duration-300 group-hover:translate-x-1 ${
          isSecondary 
            ? 'bg-slate-700/30 border-slate-600 group-hover:bg-slate-600 group-hover:border-slate-400' 
            : 'bg-blue-500/10 border-blue-500/30 group-hover:bg-blue-500 group-hover:border-blue-400'
        }`}>
          <svg className={`w-3 h-3 md:w-4 md:h-4 transition-colors ${isSecondary ? 'text-slate-400 group-hover:text-white' : 'text-blue-400 group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </>
  );

  return (
    <button
      className={`${baseStyles} ${getShapeStyles()} ${getVariantClasses()} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {(variant === 'sleekPrimary') ? (
        renderSleekContent(false)
      ) : (variant === 'sleekSecondary') ? (
        renderSleekContent(true)
      ) : (
        <>
           {variant === 'submit' && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent -translate-x-[200%] animate-[shimmer_2s_infinite]"></div>
              <div className="absolute inset-0 rounded-xl border border-blue-400/30 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            </>
          )}
          <span className="relative z-10 flex items-center justify-center gap-2">
            {children}
          </span>
        </>
      )}
    </button>
  );
};