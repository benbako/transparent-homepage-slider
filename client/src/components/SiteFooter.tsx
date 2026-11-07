import { siteLinks } from "./SiteHeader";
import SiteLogo from "./SiteLogo";

export default function SiteFooter() {
  return <>
    <footer className="footer">
      <div className="footer-brand"><a href="/" aria-label="LJ Sports Tech home"><SiteLogo /></a><p>Making more room for play.</p></div>
      <div className="footer-column"><span>EXPLORE</span><a href="/products.html">Products</a>{siteLinks.map(link => <a key={link.label} href={link.href}>{link.label}</a>)}<a href="/solutions">Solutions</a><a href="/services.html">Services</a></div>
      <div className="footer-column"><span>GET IN TOUCH</span><a href="/contact">Contact us</a><a href="mailto:sarah@ljsportstech.com">Email us</a><a href="https://wa.me/8619927435575" target="_blank" rel="noreferrer">WhatsApp ↗</a><a href="tel:+8619927435575">+86 199 2743 5575</a></div>
      <div className="footer-column footer-location"><span>FIND US</span><p>Liangjia Technology Building<br/>No. 170 Donghuan Rd, Shiqiao Street<br/>Guangzhou, China</p></div>
    </footer>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} LIANGJIA SPORTS TECHNOLOGY</span><span>SPORT HAS A NEW HOME.</span><a href="#top">BACK TO TOP ↑</a></div>
  </>;
}
