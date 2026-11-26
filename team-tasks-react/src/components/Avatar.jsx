export function Avatar({ name = '', size = 'medium' }) {
  const safeName = typeof name === 'string' ? name : ''
  const initials = safeName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toLocaleUpperCase('ru-RU') || '?'

  return <span className={`avatar avatar-${size}`} aria-hidden="true">{initials}</span>
}
