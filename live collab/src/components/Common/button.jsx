import { classNames } from '@/utils/helpers';

const variants = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600 shadow-soft',
  secondary: 'bg-white text-ink-700 border border-ink-300 hover:bg-ink-100',
  ghost: 'text-ink-700 hover:bg-ink-100',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

export default function Button({
  children,
  variant = 'primary',
  icon,
  className = '',
  ...props
}) {
  return (
    <button
      className={classNames(
        'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
} //button.jsx