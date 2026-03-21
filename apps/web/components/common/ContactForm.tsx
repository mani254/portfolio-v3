"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import PhoneInput, { Value } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "sonner";
import * as z from "zod";

const SERVICES = [
  "Single Page Website",
  "Ui/Ux design",
  "Poster Desgin",
  "Multiple Page Website",
  "Fontend-Application",
  "Backend-Application",
  "E-Commerce Website",
  "Other",
  "N/A"
];

const BUDGETS = [
  "5-15k",
  "15-30k",
  "30-40k",
  "40-70k",
  "70-90k",
  "+100k",
  "N/A"
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phoneNo: z.string().optional(),
  service: z.string().min(1, {
    message: "Please select a service.",
  }),
  budget: z.string().min(1, {
    message: "Please select a budget.",
  }),
  description: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type ContactFormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNo: "",
      service: "",
      budget: "",
      description: "",
    },
  });

  const onSubmit: SubmitHandler<ContactFormValues> = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          message: values.description
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      toast.success("Message sent successfully! I'll get back to you soon.");
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-left">
        {/* Services Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground/80 tracking-tight">What Service You are looking for?</h3>
          <FormField<ContactFormValues, "service">
            control={form.control}
            name="service"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {SERVICES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => field.onChange(s)}
                        className={`flex-list-button opacity-90 hover:text-background ${s === field.value ? "bg-foreground text-background" : ""}`}
                      >
                        <span className="text-xs sm:text-sm font-medium">{s}</span>
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Budget Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground/80 tracking-tight">Your Budget (INR)</h3>
          <FormField<ContactFormValues, "budget">
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {BUDGETS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => field.onChange(b)}
                        className={`flex-list-button opacity-90 hover:text-background ${b === field.value ? "bg-foreground text-background" : ""}`}
                      >
                        <span className="text-xs sm:text-sm font-medium">{b}</span>
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Input Fields Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 pt-4">
          <FormField<ContactFormValues, "name">
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl>
                  <div className="relative group pt-4">
                    <AnimatePresence>
                      {field.value && (
                        <motion.span
                          initial={{ opacity: 0, y: 10, x: 0 }}
                          animate={{ opacity: 1, y: -20, x: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 top-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40"
                        >
                          Your Name
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <input
                      placeholder={field.value ? "" : "Your Name"}
                      className="w-full bg-transparent border-b border-border/40 py-1 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-foreground/60"
                      {...field}
                    />
                    <div className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-foreground/60 transition-all duration-500 group-focus-within:w-full" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField<ContactFormValues, "email">
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl>
                  <div className="relative group pt-4">
                    <AnimatePresence>
                      {field.value && (
                        <motion.span
                          initial={{ opacity: 0, y: 10, x: 0 }}
                          animate={{ opacity: 1, y: -20, x: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 top-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40"
                        >
                          Your Email
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <input
                      placeholder={field.value ? "" : "Your Email"}
                      type="email"
                      className="w-full bg-transparent border-b border-border/40 py-1 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-foreground/60"
                      {...field}
                    />
                    <div className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-foreground/60 transition-all duration-500 group-focus-within:w-full" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField<ContactFormValues, "phoneNo">
            control={form.control}
            name="phoneNo"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl>
                  <div className="relative group border-b border-border/40 py-1 pt-4 focus-within:border-foreground/60 transition-all duration-300">
                    <AnimatePresence>
                      {field.value && (
                        <motion.span
                          initial={{ opacity: 0, y: 10, x: 0 }}
                          animate={{ opacity: 1, y: -20, x: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 top-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40"
                        >
                          Your Phone Number
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <PhoneInput
                      placeholder={field.value ? "" : "Your Phone Number"}
                      value={field.value as Value}
                      onChange={field.onChange}
                      defaultCountry="IN"
                      className="phone-input-custom outline-none focus:outline-none focus:ring-none"
                    />
                    <div className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-foreground/60 transition-all duration-500 group-focus-within:w-full" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="md:col-span-2">
            <FormField<ContactFormValues, "description">
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <div className="relative group pt-4">
                      <AnimatePresence>
                        {field.value && (
                          <motion.span
                            initial={{ opacity: 0, y: 10, x: 0 }}
                            animate={{ opacity: 1, y: -20, x: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute left-0 top-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40"
                          >
                            Message
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <textarea
                        placeholder={field.value ? "" : "Message"}
                        className="w-full min-h-[120px] bg-transparent border-b border-border/40 py-1 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-foreground/60 resize-none"
                        {...field}
                      />
                      <div className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-foreground/60 transition-all duration-500 group-focus-within:w-full" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="pt-10">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-14 w-full cursor-pointer rounded-full font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Sending Inquiry...
              </>
            ) : (
              <>
                <Send className="mr-3 h-5 w-5" />
                Send Inquiry
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
