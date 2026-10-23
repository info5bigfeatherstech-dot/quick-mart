import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/**
 * Reusable PhoneInput component with country prefix and numeric formatting
 */
const PhoneInput = ({
  value = '',
  onChange,
  error,
  countryCode = '+91',
  placeholder = 'Enter 10-digit mobile number',
  className = '',
  autoFocus = false,
  disabled = false,
  ...props
}) => {
  const handleInputChange = (e) => {
    const rawVal = e.target.value;
    // Strip non-digits and cap at 10 digits
    const digitsOnly = rawVal.replace(/\D/g, '').slice(0, 10);
    onChange?.(digitsOnly);
  };

  return (
    <div className="w-full space-y-1">
      <div
        className={cn(
          'flex items-center rounded-xl border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all overflow-hidden',
          error && 'border-destructive focus-within:ring-destructive',
          className
        )}
      >
        {/* Country Code Prefix */}
        <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-secondary text-foreground text-sm font-semibold select-none border-r border-border shrink-0 h-12 sm:h-11">
          <span role="img" aria-label="India Flag">
            🇮🇳
          </span>
          <span>{countryCode}</span>
        </div>

        {/* Input */}
        <Input
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={disabled}
          maxLength={10}
          className="border-0 bg-transparent text-base sm:text-sm focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-2 w-full h-12 sm:h-11 shadow-none font-medium tracking-wide"
          {...props}
        />
      </div>

      {/* Inline Error Message */}
      {error && (
        <p className="text-xs text-destructive font-medium pl-1 animate-in fade-in-50 duration-200">
          {error}
        </p>
      )}
    </div>
  );
};

export default PhoneInput;
