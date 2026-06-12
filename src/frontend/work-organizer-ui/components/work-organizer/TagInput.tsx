import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TagBadge } from './TagBadge'
import type { Tag } from '@/hooks/useWorkOrganizerState'

interface TagInputProps {
  tags: Tag[]
  onAdd: (name: string) => void | Promise<void>
  onRemove: (tagId: string) => void | Promise<void>
  placeholder?: string
  disabled?: boolean
}

export function TagInput({
  tags,
  onAdd,
  onRemove,
  placeholder = 'Add a tag…',
  disabled = false,
}: TagInputProps) {
  const [value, setValue] = useState('')

  const submit = async () => {
    const name = value.trim()
    if (!name || disabled) return
    await onAdd(name)
    setValue('')
  }

  return (
    <div className="space-y-3">
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <TagBadge
              key={tag.id}
              tag={tag}
              onRemove={disabled ? undefined : () => void onRemove(tag.id)}
            />
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              void submit()
            }
          }}
        />
        <Button type="button" size="sm" onClick={() => void submit()} disabled={disabled || !value.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
