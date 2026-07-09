export function Skeleton({ type = 'page', children = null }) {
  return (
    <div className="w-full h-full min-h-[240px] flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
      {type === 'page' ? 'Loading page...' : 'Loading...'}
      {children}
    </div>
  );
}

export default Skeleton;