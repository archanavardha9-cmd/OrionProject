export default function Button({
  className = '',
  variant = 'dark',
  size = 'medium',
  asChild = false,
  component: Component = 'button',
  children,
  ...rest
}) {
  const Tag = asChild ? Component : 'button'
  const base =
    'inline-flex items-center justify-center gap-10 border cursor-pointer font-sans transition-all duration-200'
  const variants = {
    dark: 'bg-ink text-white border-transparent hover:bg-[#5b5140] hover:translate-y-[-2px]',
    quiet:
      'bg-white/25 border-ink/24 text-ink hover:bg-white hover:border-transparent',
    outline: 'text-ink border-[#bcb29f] hover:bg-white',
    ghost: 'text-muted hover:text-ink',
    link: 'text-ink underline hover:underline',
  }
  const sizes = {
    small: 'px-10 py-14 text-[8px]',
    medium: 'px-18 py-4 text-[10px]',
    large: 'px-24 py-6 text-[11px]',
  }
  return (
    <Tag
      className={`button button-${variant} button-size-${size} ${base} ${variants[variant]} ${sizes[size]} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  )
}
