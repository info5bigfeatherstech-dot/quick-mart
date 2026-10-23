import React from 'react';
import { Input as ShadcnInput } from '@/components/ui/input';

const Input = React.forwardRef(({ icon: Icon, className = '', wrapperClassName = '', ...props }, ref) => {
  if (Icon) {
    return (
      <div className={`relative flex items-center ${wrapperClassName}`}>
        <Icon className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <ShadcnInput ref={ref} className={`pl-10 ${className}`} {...props} />
      </div>
    );
  }

  return <ShadcnInput ref={ref} className={className} {...props} />;
});

Input.displayName = 'Input';

export default Input;
