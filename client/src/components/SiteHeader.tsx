import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronRight, Menu, X } from "lucide-react";
import SiteLogo from "./SiteLogo";
import ProductMenu from "./ProductMenu";
import MobileProductDrawer from "./MobileProductDrawer";
import { catalogGroups } from "../data/productCatalog";
import "./mobile-navigation.css";

export const siteLinks = [
  { label: "Experiences", href: "/experiences" },
  { label: "Solutions", href: "/solutions" },
  { label: "About", href: "/about" },
];

export default function SiteHeader({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const productsEntryRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);

  function closeMenu(restoreFocus = false) {
    if (restoreFocus) menuToggleRef.current?.focus({ preventScroll: true });
    setOpen(false);
    setShowProducts(false);
  }

  function backToMenu() {
    setShowProducts(false);
    requestAnimationFrame(() => productsEntryRef.current?.focus());
  }

  useEffect(() => {
    if (!open) return;
    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Keep the covered page out of the accessibility and tab order while the
    // full-screen navigation is open, restoring any pre-existing inert state.
    const inerted: { element: HTMLElement; wasInert: boolean }[] = [];
    let branch: HTMLElement | null = headerRef.current;
    while (branch?.parentElement && branch.parentElement !== document.documentElement) {
      const parent: HTMLElement = branch.parentElement;
      Array.from(parent.children).forEach(sibling => {
        if (sibling !== branch && sibling instanceof HTMLElement && !["SCRIPT", "STYLE", "LINK"].includes(sibling.tagName)) {
          inerted.push({ element: sibling, wasInert: sibling.hasAttribute("inert") });
          sibling.setAttribute("inert", "");
        }
      });
      branch = parent;
    }

    const desktop = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = () => {
      if (desktop.matches) {
        setOpen(false);
        setShowProducts(false);
        requestAnimationFrame(() => headerRef.current?.querySelector<HTMLElement>(".product-menu--desktop .product-menu__toggle")?.focus({ preventScroll: true }));
      }
    };
    desktop.addEventListener("change", closeOnDesktop);
    closeOnDesktop();
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
      inerted.forEach(({ element, wasInert }) => { if (!wasInert) element.removeAttribute("inert"); });
    };
  }, [open]);

  useEffect(() => {
    if (open && !showProducts) productsEntryRef.current?.focus({ preventScroll: true });
  }, [open, showProducts]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (event.isComposing || event.keyCode === 229) return;
        const target = event.target;
        if (target instanceof HTMLInputElement && target.type === "search" && target.value) return;
        event.preventDefault();
        if (showProducts) backToMenu();
        else closeMenu(true);
        return;
      }
      if (event.key !== "Tab") return;
      const controls = Array.from(headerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]'
      ) ?? []).filter(element => element.getClientRects().length > 0);
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && (document.activeElement === first || !controls.includes(document.activeElement as HTMLElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !controls.includes(document.activeElement as HTMLElement))) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, showProducts]);

  return (
    <header ref={headerRef} className={`site-header${open ? " site-header--mobile-open" : ""}`} role={open ? "dialog" : undefined} aria-modal={open ? "true" : undefined} aria-label={open ? "Site navigation" : undefined}>
      <a className="logo-link" href="/" aria-label="LJ Sports Tech home" onClick={() => closeMenu()}>
        <SiteLogo />
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        <ProductMenu groups={catalogGroups} variant="desktop" />
        {siteLinks.map(link => <a key={link.label} href={link.href} aria-current={active === link.href ? "page" : undefined}>{link.label}</a>)}
      </nav>
      <a className="header-cta" href="/contact">LET'S TALK <ArrowUpRight size={16} strokeWidth={1.8} /></a>
      <button ref={menuToggleRef} className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => open ? closeMenu() : setOpen(true)}>
        {open ? <X size={25} /> : <Menu size={25} />}
      </button>
      {open && <nav ref={mobileNavRef} className={`mobile-nav ${showProducts ? "mobile-nav--products" : "mobile-nav--main"}`} id="mobile-menu" aria-label={showProducts ? "Product navigation" : "Mobile navigation"}>
        {showProducts ? <MobileProductDrawer groups={catalogGroups} onBack={backToMenu} onClose={() => closeMenu(true)} /> : <>
          <button ref={productsEntryRef} className="mobile-products-entry" type="button" onClick={() => setShowProducts(true)}>
            <span>Products</span><ChevronRight size={20} aria-hidden="true" />
          </button>
          {siteLinks.map(link => <a key={link.label} href={link.href} aria-current={active === link.href ? "page" : undefined} onClick={() => closeMenu()}>{link.label}<ArrowUpRight size={20}/></a>)}
          <a href="/contact" onClick={() => closeMenu()}>Let's talk <ArrowUpRight size={20}/></a>
        </>}
      </nav>}
    </header>
  );
}
