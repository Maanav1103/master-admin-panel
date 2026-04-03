"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  label?: string
  placeholder?: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  error?: boolean
  errorMessage?: string
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  className?: string
  id?: string
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long", 
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

function parseDate(value: string): Date | undefined {
  if (!value) return undefined
  
  // Try different date formats
  const formats = [
    // MM/DD/YYYY
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
    // MM-DD-YYYY
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
    // YYYY-MM-DD
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
  ]
  
  for (const format of formats) {
    const match = value.match(format)
    if (match) {
      let [, part1, part2, part3] = match
      let date: Date
      
      if (format === formats[2]) { // YYYY-MM-DD
        date = new Date(parseInt(part1), parseInt(part2) - 1, parseInt(part3))
      } else { // MM/DD/YYYY or MM-DD-YYYY
        date = new Date(parseInt(part3), parseInt(part1) - 1, parseInt(part2))
      }
      
      if (isValidDate(date)) {
        return date
      }
    }
  }
  
  // Try native Date parsing as fallback
  const date = new Date(value)
  return isValidDate(date) ? date : undefined
}

export function DatePicker({
  label,
  placeholder = "Select date",
  value,
  onChange,
  error = false,
  errorMessage,
  minDate,
  maxDate,
  disabled = false,
  className,
  id,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date | undefined>(value || new Date())
  const [inputValue, setInputValue] = React.useState(formatDate(value))

  // Update input value when value prop changes
  React.useEffect(() => {
    setInputValue(formatDate(value))
    if (value) {
      setMonth(value)
    }
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    
    const parsedDate = parseDate(newValue)
    if (isValidDate(parsedDate)) {
      // Validate against min/max dates
      if (minDate && parsedDate! < minDate) return
      if (maxDate && parsedDate! > maxDate) return
      
      onChange?.(parsedDate)
      setMonth(parsedDate)
    }
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Validate against min/max dates
      if (minDate && selectedDate < minDate) return
      if (maxDate && selectedDate > maxDate) return
      
      onChange?.(selectedDate)
      setInputValue(formatDate(selectedDate))
      setMonth(selectedDate)
    }
    setOpen(false)
  }

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </Label>
      )}
      <div className="relative flex gap-2">
        <Input
          id={id}
          value={inputValue}
          placeholder={placeholder}
          className={cn(
            "bg-background pr-10",
            error && "border-red-500 focus-visible:ring-red-500",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onChange={handleInputChange}
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" && !disabled) {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen} modal={true}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
              disabled={disabled}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setOpen(!open)
              }}
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0 z-50"
            align="end"
            alignOffset={-8}
            sideOffset={10}
            onInteractOutside={(e) => {
              // Prevent closing when clicking inside the popover
              e.preventDefault()
            }}
            onEscapeKeyDown={() => setOpen(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <Calendar
                mode="single"
                selected={value}
                captionLayout="dropdown"
                month={month}
                onMonthChange={setMonth}
                onSelect={handleDateSelect}
                disabled={isDateDisabled}
                fromDate={minDate}
                toDate={maxDate}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {error && errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  )
}