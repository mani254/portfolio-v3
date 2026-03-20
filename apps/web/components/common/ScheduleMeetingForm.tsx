"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Clock, Globe, Loader2, Mail, User } from "lucide-react"
import * as React from "react"
import { useForm, type ControllerRenderProps } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { commonTimezones } from "@/lib/consts"
import { DateTimePicker } from "./DateTimePicker"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  duration: z.string().min(1, "Please select a duration"),
  timezone: z.string().min(1, "Please select a timezone"),
  dateTime: z.date({
    message: "Please select a date and time",
  }),
})

type FormValues = z.infer<typeof formSchema>




interface ScheduleMeetingFormProps {
  onSuccess: () => void
}

export function ScheduleMeetingForm({ onSuccess }: ScheduleMeetingFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      duration: "30",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/schedule-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          dateTime: values.dateTime.toISOString(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to schedule meeting")
      }

      toast.success("Meeting scheduled successfully! I'll see you then.")
      onSuccess()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again."
      toast.error(errorMessage)
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT COLUMN: Fields */}
          <div className="md:min-w-[220px] space-y-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }: { field: ControllerRenderProps<FormValues, 'name'> }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-medium text-xs">
                      <User className="w-4 h-4 text-primary" />
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" className="text-xs placeholder:text-xs placeholder:opacity-50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }: { field: ControllerRenderProps<FormValues, 'email'> }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-medium text-xs">
                      <Mail className="w-4 h-4 text-primary" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Your email address" type="email" className="text-xs placeholder:text-xs placeholder:opacity-50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4 md:block md:space-y-4">
              <div className="flex-1 space-y-2">
                <FormLabel className="flex items-center gap-2 font-medium text-xs">
                  <Clock className="w-4 h-4 text-primary" />
                  Duration
                </FormLabel>
                <div className="h-8 flex items-center px-2.5 text-xs bg-muted/20 border border-input rounded-lg text-muted-foreground font-medium">
                  30 min meeting
                </div>
              </div>
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }: { field: ControllerRenderProps<FormValues, 'timezone'> }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="flex items-center gap-2 font-medium text-xs">
                      <Globe className="w-4 h-4 text-primary" />
                      Timezone
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full text-xs data-placeholder:text-xs">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper" className="max-h-[200px]">
                        {commonTimezones.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value} className="text-xs">
                            {tz.label}
                          </SelectItem>
                        ))}
                        {!commonTimezones.find(t => t.value === field.value) && (
                          <SelectItem value={field.value} className="text-xs">{field.value}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Date/Time Picker */}
          <div className="w-full">
            <FormField
              control={form.control}
              name="dateTime"
              render={({ field }: { field: ControllerRenderProps<FormValues, 'dateTime'> }) => (
                <FormItem className="flex flex-col h-full">
                  <FormLabel className="mb-2 font-medium text-xs">Select Date & Time</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      date={field.value as Date}
                      onChange={field.onChange}
                      timezone={form.watch("timezone")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-primary/10">
          <Button
            type="submit"
            className="w-full lg:w-auto px-8 py-6 cursor-pointer rounded-xl text-sm font-bold shadow-lg hover:shadow-primary/20 transition-all duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Scheduling...
              </>
            ) : (
              "Confirm Meeting"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
