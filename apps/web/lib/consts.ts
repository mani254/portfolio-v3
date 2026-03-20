import { Github, Linkedin, Twitter } from "lucide-react"

export const commonTimezones = [
  { label: "Asia/Kolkata (IST)", value: "Asia/Kolkata" },
  { label: "UTC", value: "UTC" },
  { label: "America/New_York (EST/EDT)", value: "America/New_York" },
  { label: "America/Los_Angeles (PST/PDT)", value: "America/Los_Angeles" },
  { label: "America/Chicago (CST/CDT)", value: "America/Chicago" },
  { label: "Europe/London (GMT/BST)", value: "Europe/London" },
  { label: "Europe/Paris (CET/CEST)", value: "Europe/Paris" },
  { label: "Europe/Berlin (CET/CEST)", value: "Europe/Berlin" },
  { label: "Asia/Dubai (GST)", value: "Asia/Dubai" },
  { label: "Asia/Singapore (SGT)", value: "Asia/Singapore" },
  { label: "Asia/Tokyo (JST)", value: "Asia/Tokyo" },
  { label: "Asia/Hong_Kong (HKT)", value: "Asia/Hong_Kong" },
  { label: "Australia/Sydney (AEDT/AEST)", value: "Australia/Sydney" },
  { label: "America/Sao_Paulo (BRT)", value: "America/Sao_Paulo" },
]

export const footerLinks = [
  {
    title: "General",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Projects", href: "/projects" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Specifics",
    links: [
      { label: "Guest Book", href: "/guestbook" },
      { label: "Uses", href: "/uses" },
      { label: "Integration", href: "/integration" },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Book a Call", href: "/book-a-call" },
      { label: "Links", href: "/links" },
      { label: "RSS", href: "/rss" },
    ],
  },
]

export const socialLinks = [
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
]
