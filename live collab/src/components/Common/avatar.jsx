import { initialsFromName, classNames } from '@/utils/helpers';

export function Avatar({ name, src, size = 32, online, bg = '#4F46E5', ringColor = '#FFFFFF' }) {
  const dimension = { width: size, height: size, minWidth: size, minHeight: size };

  return (
    <div style={{ position: 'relative', display: 'inline-block', ...dimension }}>
      {src ? (
        <img
          src={src}
          alt={name}
          style={{
            ...dimension,
            borderRadius: '50%',
            objectFit: 'cover',
            border: `2px solid ${ringColor}`
          }}
        />
      ) : (
        <div
          style={{
            ...dimension,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bg,
            color: '#fff',
            fontWeight: 600,
            fontSize: size * 0.4,
            border: `2px solid ${ringColor}`
          }}
        >
          {initialsFromName(name)}
        </div>
      )}
      {online && (
        <span 
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '10px',
            height: '10px',
            backgroundColor: '#10B981',
            border: `2px solid ${ringColor}`,
            borderRadius: '50%'
          }} 
        />
      )}
    </div>
  );
}

export default Avatar;