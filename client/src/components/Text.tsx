interface Props {
  children: React.ReactNode,
  size: number|string,
  position?: string,
  muted?: boolean,
  hide?: boolean,
  className?: string,
};
function Text({children, size, position, muted, hide, className = ''}:Props) {
  const classString = (): string => {
    const classes = ['m-0', `h${size}`];
    if(position) {
      classes.push(`text-${position}`);
    }
    if(hide) {
      classes.push('opacity-0');
    }
    if(muted) {
      classes.push('text-muted');
    }
    if(className) {
      classes.push(className);
    }
    return classes.join(' ');
  }

  return (
    <p className={classString()}>{children}</p>
  )
}

export default Text;