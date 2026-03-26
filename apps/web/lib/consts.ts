import { Github, Instagram, Linkedin, Mail, MessageCircle, Twitter } from "lucide-react";

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
    title: "More",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Book a Call", href: "/book-a-call" },
      { label: "Links", href: "/links" },
    ],
  },
]

export const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "Blogs", to: "/blogs" },
  {
    label: "More", to: undefined,
  },
  { label: "Let's Talk", to: '/contact', active: true }
];

export const MOBILE_NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Projects", to: "/projects" },
  { label: "Contact", to: "/contact" },
];

export const CONTACT_LINKS = [
  {
    name: "Github",
    href: "https://github.com/mani254",
    icon: Github,
  },
  {
    name: "Linkedin",
    href: "https://www.linkedin.com/in/sai0421/",
    icon: Linkedin,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/dev_mani25/",
    icon: Instagram,
  },
  {
    name: "Youtube",
    href: "https://www.youtube.com/channel/UCCdkYdNdJYuyQx_ky5GTvYg",
    icon: Github, // Using Github as placeholder if Youtube icon not in lucide-react (or I should check)
  },
  {
    name: "Whatsapp",
    href: "https://wa.me/+918688014415",
    icon: MessageCircle,
  },
  {
    name: "Email",
    href: "mailto:manifreelancer25@gmail.com",
    icon: Mail,
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: Twitter,
  },
];

export const TECH_CATEGORIES = ["Languages", "Frameworks & Libraries", "Databases & Tools", "Other"];