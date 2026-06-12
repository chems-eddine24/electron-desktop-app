export type TagColor =
  | 'slate'
  | 'violet'
  | 'blue'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'cyan'
  | 'orange'

const TAG_COLOR_CLASSES: Record<TagColor, string> = {
  slate: 'bg-slate-500/20 text-slate-300 ring-slate-500/30',
  violet: 'bg-violet-500/20 text-violet-300 ring-violet-500/30',
  blue: 'bg-blue-500/20 text-blue-300 ring-blue-500/30',
  emerald: 'bg-emerald-500/20 text-emerald-300 ring-emerald-500/30',
  amber: 'bg-amber-500/20 text-amber-300 ring-amber-500/30',
  rose: 'bg-rose-500/20 text-rose-300 ring-rose-500/30',
  cyan: 'bg-cyan-500/20 text-cyan-300 ring-cyan-500/30',
  orange: 'bg-orange-500/20 text-orange-300 ring-orange-500/30',
}

const TAG_COLOR_CLASSES_LIGHT: Record<TagColor, string> = {
  slate: 'bg-slate-200 text-slate-700 ring-slate-300',
  violet: 'bg-violet-100 text-violet-800 ring-violet-200',
  blue: 'bg-blue-100 text-blue-800 ring-blue-200',
  emerald: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  amber: 'bg-amber-100 text-amber-900 ring-amber-200',
  rose: 'bg-rose-100 text-rose-800 ring-rose-200',
  cyan: 'bg-cyan-100 text-cyan-800 ring-cyan-200',
  orange: 'bg-orange-100 text-orange-900 ring-orange-200',
}

export function tagColorClass(color: string, isDark = true): string {
  const key = (color in TAG_COLOR_CLASSES ? color : 'slate') as TagColor
  return isDark ? TAG_COLOR_CLASSES[key] : TAG_COLOR_CLASSES_LIGHT[key]
}

export function mapDbTag(row: { tag_id: string; tag_name: string; tag_color: string }) {
  return {
    id: row.tag_id,
    name: row.tag_name,
    color: row.tag_color,
  }
}
