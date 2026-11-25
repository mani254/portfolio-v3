"use client";

import { ContactForm } from "@/components/common/ContactForm";
import { ScheduleMeetingForm } from "@/components/common/ScheduleMeetingForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Mail } from "lucide-react";
import { useCallback, useState } from "react";

const TABS = [
  { value: "book-a-call", label: "Book a Call", icon: Calendar },
  { value: "send-message", label: "Send Message", icon: Mail },
];

export const ContactTabs = ({ initialTab }: { initialTab: string }) => {
  const [activeTab, setActiveTab] = useState(
    initialTab === "form" || initialTab === "send-message" ? "send-message" : "book-a-call"
  );

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  return (
    <div className="w-full">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        {/* Centered Switcher */}
        <div className="flex justify-center mb-8">
          <div className="p-1 bg-white/90 backdrop-blur-md rounded-full border border-border/80 shadow-2xs">
            <TabsList className="bg-transparent border-none h-10 gap-1 p-0">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="cursor-pointer inline-flex items-center gap-2 px-6 sm:px-8 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all data-[state=active]:bg-[#111827] data-[state=active]:text-white data-[state=active]:shadow-2xs data-[state=inactive]:text-muted-foreground hover:text-foreground select-none"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
        </div>

        {/* Tab 1: Book a Call (Full Width, No Box Container) */}
        <TabsContent value="book-a-call" className="mt-0 outline-none w-full">
          <div className="w-full">
            <ScheduleMeetingForm />
          </div>
        </TabsContent>

        {/* Tab 2: Send Message (Full Width, No Box Container) */}
        <TabsContent value="send-message" className="mt-0 outline-none w-full">
          <div className="w-full max-w-3xl mx-auto py-2">
            <ContactForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
