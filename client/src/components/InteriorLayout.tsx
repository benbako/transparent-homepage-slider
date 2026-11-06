import { useEffect, type ReactNode } from "react";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

interface InteriorLayoutProps {
  active: string;
  title: string;
  description: string;
  children: ReactNode;
}

export default function InteriorLayout({ active, title, description, children }: InteriorLayoutProps) {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
  }, [title, description]);

  return <>
    <SiteHeader active={active}/>
    {children}
    <div className="site-footer-shell contact-section page-gutter"><SiteFooter/></div>
  </>;
}
