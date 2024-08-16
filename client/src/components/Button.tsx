import { MouseEventHandler, memo } from 'react';
import { cn } from '../platform-agnostic/utils/string.ts';
import './Button.css';

/**
 * Types
 */

type NormalButtonProps = Partial<{
  text: string;
  loadingText: string;
  className: string;
  disabled: boolean;
  loading: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}>;

/**
 * Normal button, normal size
 */

export const Button = memo((p: NormalButtonProps) => {
  const { text, loadingText, disabled, loading, className, onClick } = p;
  return (
    <button
      className={cn('btn h_center', className)}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? loadingText : text}
    </button>
  );
});

Button.displayName = 'Button';

Button.defaultProps = {
  loadingText: 'Loading...'
};
