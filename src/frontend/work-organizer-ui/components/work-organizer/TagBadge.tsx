import { X } from 'lucide-react'
import { tagColorClass } from '@/lib/tag-colors'
import { useTheme } from '@/hooks/useTheme'
import type { Tag } from '@/hooks/useWorkOrganizerState'

interface TagBadgeProps {
  tag: Tag
  onRemove?: () => void
}

export function TagBadge({ tag, onRemove }: TagBadgeProps) {
  const { isDark } = useTheme()

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tagColorClass(tag.color, isDark)}`}
    >
      {tag.name}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
          aria-label={`Remove tag ${tag.name}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}
