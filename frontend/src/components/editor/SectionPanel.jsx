import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function SectionPanel({ id, label, isActive, isHidden, onSelect, onToggle, onSettings }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '6px 6px',
        borderRadius: 7,
        marginBottom: 2,
        background: isActive ? 'var(--bg-elevated)' : 'transparent',
        border: `1px solid ${isActive ? 'var(--border)' : 'transparent'}`,
        cursor: 'pointer',
      }}
      onClick={onSelect}
    >
      <span
        {...attributes}
        {...listeners}
        style={{ color: 'var(--text-muted)', fontSize: 13, cursor: 'grab', padding: '0 2px', userSelect: 'none', flexShrink: 0 }}
        onClick={e => e.stopPropagation()}
      >⠿</span>

      <span style={{ flex: 1, fontSize: 12.5, color: isHidden ? 'var(--text-muted)' : isActive ? 'var(--text-heading)' : 'var(--text)', fontWeight: isActive ? 600 : 400 }}>
        {label}
      </span>

      <button
        onClick={e => { e.stopPropagation(); onSettings && onSettings() }}
        title="Section settings"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: isActive ? 'var(--accent)' : 'var(--text-muted)', fontSize: 12, padding: 2, opacity: 0.7, flexShrink: 0 }}
      >⚙</button>

      <button
        onClick={e => { e.stopPropagation(); onToggle() }}
        title={isHidden ? 'Show' : 'Hide'}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: isHidden ? 'var(--text-muted)' : 'var(--accent)', fontSize: 13, padding: 2, opacity: isHidden ? 0.35 : 1, flexShrink: 0 }}
      >{isHidden ? '○' : '●'}</button>
    </div>
  )
}
