"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { UnifiedCalendar } from "@/components/ui/UnifiedCalendar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/Textarea"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Save, Loader2, Trash2, X, Tag, Bold, Italic, Underline, Heading1, Heading2, List, ListOrdered, Quote, Image as ImageIcon, Pencil } from "lucide-react"
import SaveStatus from "@/components/journal/SaveStatus"
import { toast } from "react-hot-toast"
import { cn } from "@/lib/utils"

interface JournalEntry {
  id: number
  content: string
  title?: string | null
  imageUrl?: string | null
  mood?: string | null
  tags?: string | null
  date: Date
}

interface JournalClientProps {
  initialDate: Date
  initialEntry: JournalEntry | null
  recentEntries: JournalEntry[]
}

export default function JournalClient({ initialDate, initialEntry, recentEntries }: JournalClientProps) {
  const router = useRouter()
  const [date, setDate] = useState<Date>(initialDate)
  const [content, setContent] = useState(initialEntry?.content || "")
  const [title, setTitle] = useState(initialEntry?.title || "New Entry")
  const [tags, setTags] = useState<string[]>(() => {
    try {
      return initialEntry?.tags ? JSON.parse(initialEntry.tags) : []
    } catch {
      return []
    }
  })
  const [tagInput, setTagInput] = useState("")
  const [imageUrl, setImageUrl] = useState(initialEntry?.imageUrl || "")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const autosaveTimerRef = useRef<number | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setContent(initialEntry?.content || "")
    setTitle(initialEntry?.title || "New Entry")
    setImageUrl(initialEntry?.imageUrl || "")
    setImageFile(null)
    try {
      setTags(initialEntry?.tags ? JSON.parse(initialEntry.tags) : [])
    } catch {
      setTags([])
    }
    // reset dirty state when a new initial entry loads
    setDirty(false)
  }, [initialEntry])

  const handleDateSelect = (newDate: Date) => {
    if (!newDate) return
    setDate(newDate)
    const dateStr = format(newDate, 'yyyy-MM-dd')
    router.push(`/journal?date=${dateStr}`)
  }

  const handleAddTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagInput("")
      setDirty(true)
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove))
    setDirty(true)
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const applyFormatting = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const beforeText = content.substring(0, start)
    const afterText = content.substring(end)

    const newText = beforeText + prefix + selectedText + suffix + afterText
    setContent(newText)

    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + prefix.length + selectedText.length + suffix.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB")
        return
      }
      setImageFile(file)
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setImageUrl(previewUrl)
      setDirty(true)
    }
  }

  const handleRemoveImage = () => {
    setImageUrl("")
    setImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSave = async (opts?: { silent?: boolean }) => {
    setIsSaving(true)
    try {
      let finalImageUrl = imageUrl

      // If there's a new image file, upload it (for now, we'll use a data URL)
      if (imageFile) {
        const reader = new FileReader()
        finalImageUrl = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(imageFile)
        })
      }

      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: date.toISOString(),
          content,
          title,
          tags: JSON.stringify(tags),
          imageUrl: finalImageUrl
        })
      })
      
      if (response.ok) {
        if (!opts?.silent) toast.success('Journal entry saved')
        setLastSavedAt(new Date())
        setDirty(false)
        router.refresh()
      } else {
        if (!opts?.silent) toast.error('Failed to save entry')
      }
    } catch (error) {
      console.error('Error saving journal:', error)
      if (!opts?.silent) toast.error('Error saving entry')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this entry? This action cannot be undone.")) {
      return
    }
    await deleteEntry(date)
  }

  // Autosave: debounce saves when content/title/tags/imageFile change
  useEffect(() => {
    // mark dirty on changes
    setDirty(true)
    if (autosaveTimerRef.current) {
      window.clearTimeout(autosaveTimerRef.current)
    }
    autosaveTimerRef.current = window.setTimeout(() => {
      // perform a silent save
      handleSave({ silent: true })
    }, 2000)

    return () => {
      if (autosaveTimerRef.current) {
        window.clearTimeout(autosaveTimerRef.current)
        autosaveTimerRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, title, tags, imageFile])

  // Keyboard shortcut: Cmd/Ctrl+S to save
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        // clear any pending autosave
        if (autosaveTimerRef.current) {
          window.clearTimeout(autosaveTimerRef.current)
          autosaveTimerRef.current = null
        }
        handleSave()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, title, tags, imageFile])

  const deleteEntry = async (entryDate: Date) => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/journal?date=${entryDate.toISOString()}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success("Journal entry deleted")
        if (format(entryDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')) {
            setContent("")
            setTitle("New Entry")
            setTags([])
            setImageUrl("")
            setImageFile(null)
        }
        router.refresh()
      } else {
        toast.error("Failed to delete entry")
      }
    } catch (error) {
      console.error('Error deleting journal:', error)
      toast.error("Error deleting entry")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[calc(100vh-12rem)]">
      {/* Left Column: Calendar & Navigation */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-card/50 backdrop-blur-sm border border-white/5 rounded-xl p-4 shadow-xl">
          <UnifiedCalendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-cinzel text-muted-foreground uppercase tracking-wider px-2">Recent Entries</h3>
          <div className="space-y-2">
            {recentEntries.map((entry) => (
              <div
                key={entry.id}
                className={cn(
                  "w-full text-left group relative overflow-hidden rounded-lg border transition-all duration-300 flex",
                  format(new Date(entry.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                    ? "border-primary/50 bg-primary/10"
                    : "border-white/5 bg-card/30 hover:bg-card/50 hover:border-white/10"
                )}
              >
                <button
                    onClick={() => handleDateSelect(new Date(entry.date))}
                    className="flex-1 text-left relative"
                >
                    {entry.imageUrl && (
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                      <Image src={entry.imageUrl} alt="" fill className="object-cover" sizes="100%" unoptimized />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
                    </div>
                    )}
                    <div className="relative p-3">
                    <div className="text-xs text-primary/80 font-mono mb-1">
                        {format(new Date(entry.date), 'MMM dd, yyyy')}
                    </div>
                    <div className="font-cinzel text-sm truncate text-foreground/90">
                        {entry.title || "Untitled Entry"}
                    </div>
                    <div className="text-xs text-muted-foreground truncate mt-1 font-crimson italic">
                        {entry.content.substring(0, 40)}...
                    </div>
                    </div>
                </button>
                
                <div className="flex flex-col border-l border-white/5">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDateSelect(new Date(entry.date));
                        }}
                        className="flex-1 px-2 hover:bg-white/10 text-muted-foreground hover:text-primary transition-colors flex items-center justify-center"
                        title="Edit"
                    >
                        <Pencil className="h-3 w-3" />
                    </button>
                    <div className="h-px bg-white/5" />
                    <button
                        onClick={async (e) => {
                            e.stopPropagation();
                            if (confirm("Delete this entry?")) {
                                await deleteEntry(new Date(entry.date));
                            }
                        }}
                        className="flex-1 px-2 hover:bg-red-900/20 text-muted-foreground hover:text-red-400 transition-colors flex items-center justify-center"
                        title="Delete"
                    >
                        <Trash2 className="h-3 w-3" />
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center Column: The Journal Page */}
      <div className="lg:col-span-9 flex flex-col">
        {/* Vignette effect container */}
        <div className="relative rounded-xl overflow-hidden">
          {/* Subtle vignette gradient overlay */}
          <div className="absolute inset-0 pointer-events-none rounded-xl" style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)'
          }} />
          
          <div className="relative bg-[#1A1A1F] border border-white/5 rounded-xl shadow-2xl overflow-hidden flex flex-col min-h-[800px]">
            {/* Minimal Top Bar with Date and Save */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gold-500/20">
              <div className="font-cinzel text-xl text-gray-300 tracking-wide">
                {format(date, 'EEEE, MMMM do, yyyy')}
              </div>
              <div className="flex items-center gap-4">
                {initialEntry && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-gray-400 hover:text-red-400 hover:bg-red-950/20"
                  >
                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </Button>
                )}
                <div className="flex items-center gap-3">
                  <SaveStatus isSaving={isSaving} dirty={dirty} lastSavedAt={lastSavedAt} />
                  <Button
                    onClick={() => { if (autosaveTimerRef.current) { window.clearTimeout(autosaveTimerRef.current); autosaveTimerRef.current = null } ; handleSave() }}
                    disabled={isSaving}
                    className="bg-gold-500 hover:bg-gold-600 text-black font-semibold shadow-lg px-6"
                    aria-label="Save journal entry"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save
                  </Button>
                </div>
              </div>
            </div>

            {/* Editor Area - Distraction Free */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="max-w-3xl mx-auto px-8 py-16 space-y-10">
                {/* Title Input - Cinzel font */}
                <div className="space-y-2">
                  <input
                    type="text"
                    value={title}
                      onChange={(e) => { setTitle(e.target.value); setDirty(true) }}
                      id="journal-title"
                      aria-label="Journal title"
                      placeholder="Title of the Day..."
                      className="w-full bg-transparent border-none text-4xl font-cinzel text-gray-200 placeholder:text-gray-600 focus:ring-0 p-0 outline-none"
                  />
                  {/* Gold soft underline beneath the date/title area */}
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
                </div>

                {/* Tags Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500 text-black text-sm font-semibold shadow-lg shadow-gold-500/20"
                      >
                        <Tag className="h-3.5 w-3.5" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          aria-label={`Remove tag ${tag}`}
                          className="ml-1 hover:opacity-70 transition-opacity"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      onBlur={handleAddTag}
                      placeholder="Add tag (Enter or comma)..."
                      className="inline-flex w-auto min-w-[200px] bg-transparent border border-white/10 text-sm text-gray-300 placeholder:text-gray-600 focus:border-gold-500/50 rounded-lg"
                    />
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    aria-hidden="true"
                    tabIndex={-1}
                  />
                  {imageUrl ? (
                    <div className="relative rounded-lg overflow-hidden border border-white/10">
                      <div className="relative w-full h-full min-h-[200px] max-h-96 bg-black/20">
                        <Image
                          src={imageUrl}
                          alt="Journal entry"
                          fill
                          className="object-contain"
                          sizes="100%"
                          unoptimized
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        aria-label="Remove image"
                        className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Add image to journal entry"
                      className="w-full py-8 border-2 border-dashed border-white/10 rounded-lg hover:border-gold-500/30 transition-colors group"
                    >
                      <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-gold-500/70">
                        <ImageIcon className="h-8 w-8" />
                        <span className="text-sm">Click to add an image</span>
                      </div>
                    </button>
                  )}
                </div>

                {/* Formatting Toolbar */}
                <div className="flex items-center gap-1 pb-3 border-b border-white/5">
                  <button
                    type="button"
                    onClick={() => applyFormatting('**', '**')}
                    className="p-2 hover:bg-white/5 rounded transition-colors text-gray-400 hover:text-gold-400"
                    title="Bold"
                    aria-label="Bold"
                  >
                    <Bold className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormatting('*', '*')}
                    className="p-2 hover:bg-white/5 rounded transition-colors text-gray-400 hover:text-gold-400"
                    title="Italic"
                    aria-label="Italic"
                  >
                    <Italic className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormatting('<u>', '</u>')}
                    className="p-2 hover:bg-white/5 rounded transition-colors text-gray-400 hover:text-gold-400"
                    title="Underline"
                    aria-label="Underline"
                  >
                    <Underline className="h-4 w-4" />
                  </button>
                  <div className="w-px h-6 bg-white/10 mx-1" />
                  <button
                    type="button"
                    onClick={() => applyFormatting('# ', '')}
                    className="p-2 hover:bg-white/5 rounded transition-colors text-gray-400 hover:text-gold-400"
                    title="Heading 1"
                    aria-label="Heading 1"
                  >
                    <Heading1 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormatting('## ', '')}
                    className="p-2 hover:bg-white/5 rounded transition-colors text-gray-400 hover:text-gold-400"
                    title="Heading 2"
                    aria-label="Heading 2"
                  >
                    <Heading2 className="h-4 w-4" />
                  </button>
                  <div className="w-px h-6 bg-white/10 mx-1" />
                  <button
                    type="button"
                    onClick={() => applyFormatting('- ', '')}
                    className="p-2 hover:bg-white/5 rounded transition-colors text-gray-400 hover:text-gold-400"
                    title="Bullet List"
                    aria-label="Bullet List"
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormatting('1. ', '')}
                    className="p-2 hover:bg-white/5 rounded transition-colors text-gray-400 hover:text-gold-400"
                    title="Numbered List"
                    aria-label="Numbered List"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormatting('> ', '')}
                    className="p-2 hover:bg-white/5 rounded transition-colors text-gray-400 hover:text-gold-400"
                    title="Quote"
                    aria-label="Quote"
                  >
                    <Quote className="h-4 w-4" />
                  </button>
                </div>

                {/* Content Textarea - Outfit font, larger line-height, softer text */}
                <Textarea
                  value={content}
                  ref={textareaRef}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Begin your reflection..."
                  className="w-full min-h-[600px] bg-transparent border-none text-lg font-outfit text-gray-300 placeholder:text-gray-700 focus:ring-0 p-0 resize-none shadow-none focus-visible:ring-0 outline-none"
                  style={{ lineHeight: '1.8' }}
                />
              </div>
            </div>

            {/* Footer Stats */}
            <div className="px-8 py-4 border-t border-white/5 bg-black/20 text-xs text-gray-500 font-mono flex justify-between items-center">
              <div>
                {content.split(/\s+/).filter((w) => w.length > 0).length} words
              </div>
              <div>{tags.length} tags</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
