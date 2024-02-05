interface Props {
  children: React.ReactNode,
  size: number|string,
  className?: string,
};
function Text({children, size, className = ''}:Props) {
  return (
    <p className={`h${size} m-0 ${className}`}>{children}</p>
  )
}

export default Text;