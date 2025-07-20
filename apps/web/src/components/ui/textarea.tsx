import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  const textareaBaseStyles =
    'border-input dark:bg-input/30 flex field-sizing-content w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow]';
  const textareaStateStyles =
    'placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50';
  const textareaSizeStyles = 'min-h-16 md:text-sm';

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        textareaBaseStyles,
        textareaStateStyles,
        textareaSizeStyles,
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
