"use client";

import { ContactForm } from "@/components/common/ContactForm";
import { ScheduleMeetingForm } from "@/components/common/ScheduleMeetingForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useState } from "react";

const TABS = [
  { value: "book-a-call", label: "Book a call" },
  { value: "send-message", label: "Send message" },
];

export const ContactTabs = ({ initialTab }: { initialTab: string }) => {
  // Pure local state for maximum performance and simplicity
  const [activeTab, setActiveTab] = useState(initialTab === "form" ? "send-message" : "book-a-call");

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="flex flex-col items-center gap-16">
        {/* Clean, Minimalist Tabs Design */}
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="flex justify-center mb-2">
            <div className="relative p-px bg-muted/20 backdrop-blur-md rounded-2xl border border-border/40">
              <TabsList className="bg-transparent border-none h-11 gap-1">
                {TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="cursor-pointer px-6 sm:px-10 py-2 rounded-xl text-sm font-semibold transition-all data-[state=active]:bg-foreground data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground hover:text-foreground"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          <div className="w-full">
            <TabsContent value="book-a-call" className="mt-0 outline-none">
              <div className="bg-card/40 backdrop-blur-md rounded-[2.5rem] border border-border/40 p-5 md:p-14 overflow-hidden relative group transition-all duration-500 hover:border-border/60">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/8 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/8 transition-colors duration-500" />
                <ScheduleMeetingForm />
              </div>
            </TabsContent>

            <TabsContent value="send-message" className="mt-0 outline-none">
              <div className="bg-card/40 backdrop-blur-md rounded-[2.5rem] border border-border/40 p-5 md:p-14 relative group transition-all duration-500 hover:border-border/60">
                <div className="absolute top-0 left-0 -ml-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/8 transition-colors duration-500" />
                <div className="absolute bottom-0 right-0 -mr-16 -mb-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/8 transition-colors duration-500" />
                <ContactForm />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
