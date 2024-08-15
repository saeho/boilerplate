import { MouseEventHandler, memo } from 'react';
import { cn } from '../platform-agnostic/utils/string.ts';
import './Button.css';

/**
 * Types
 */

type NormalButtonProps = Partial<{
  text: string;
  className: string;
  disabled: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}>;

/**
 * Normal button, normal size
 */

export const Button = memo((p: NormalButtonProps) => {
  const { text, disabled, className, onClick } = p;
  return (
    <button
      className={cn('btn h_center', className)}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
});

Button.displayName = 'Button';

