import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import SiteLogo from "./SiteLogo";

export const siteLinks = [
  { label: "Experiences", href: "/experiences" },
  { label: "Solutions", href: "/solutions" },
  { label: "About", href: "/about" },
];

export default function SiteHeader({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a className="logo-link" href="/" aria-label="LJ Sports Tech home" onClick={() => setOpen(false)}>
        <SiteLogo />
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {siteLinks.map(link => <a key={link.label} href={link.href} aria-current={active === link.href ? "page" : undefined}>{link.label}</a>)}
      </nav>
      <a className="header-cta" href="/contact">LET'S TALK <ArrowUpRight size={16} strokeWidth={1.8} /></a>
      <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
        {open ? <X size={25} /> : <Menu size={25} />}
      </button>
      {open && <nav className="mobile-nav" id="mobile-menu" aria-label="Mobile navigation">
        {siteLinks.map(link => <a key={link.label} href={link.href} aria-current={active === link.href ? "page" : undefined} onClick={() => setOpen(false)}>{link.label}<ArrowUpRight size={20}/></a>)}
        <a href="/contact" onClick={() => setOpen(false)}>Let's talk <ArrowUpRight size={20}/></a>
      </nav>}
    </header>
  );
}
