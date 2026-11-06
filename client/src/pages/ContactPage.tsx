import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import "./company-pages.css";

export default function ContactPage() {
  return (
    <main id="top" className="company-page">
      <section className="cp-contact-hero cp-gutter" aria-labelledby="contact-title">
        <div className="cp-contact-hero__content">
          <div className="cp-eyebrow"><span aria-hidden="true" /> GET IN TOUCH</div>
          <h1 id="contact-title">LET'S MAKE<br /><span>ROOM FOR</span><br />PLAY<span className="cp-blue">.</span></h1>
          <p>Have a space, project or question in mind? Tell us what you're working on.</p>
          <a className="cp-button cp-button--blue" href="mailto:sarah@ljsportstech.com">
            EMAIL US <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="cp-contact-panel" aria-label="Contact options">
          <div className="cp-contact-panel__heading"><span>CONNECT WITH LJ SPORTS TECH</span><ArrowDownRight size={20} aria-hidden="true" /></div>
          <a className="cp-contact-row" href="mailto:sarah@ljsportstech.com">
            <span className="cp-contact-row__label">EMAIL</span>
            <span className="cp-contact-row__value">sarah@ljsportstech.com</span>
            <ArrowUpRight size={19} aria-hidden="true" />
          </a>
          <a className="cp-contact-row" href="tel:+8619927435575">
            <span className="cp-contact-row__label">PHONE</span>
            <span className="cp-contact-row__value">+86 199 2743 5575</span>
            <ArrowUpRight size={19} aria-hidden="true" />
          </a>
          <a className="cp-contact-row" href="https://wa.me/8619927435575">
            <span className="cp-contact-row__label">WHATSAPP</span>
            <span className="cp-contact-row__value">+86 199 2743 5575</span>
            <ArrowUpRight size={19} aria-hidden="true" />
          </a>
          <p className="cp-contact-panel__note">Choose the way that works for you.</p>
        </div>
        <div className="cp-hero-bottom"><span>SPORTS × TECHNOLOGY × PLAY</span><span>CONTACT / LJ SPORTS TECH</span></div>
      </section>

      <section className="cp-location cp-gutter" aria-labelledby="location-title">
        <div className="cp-location__top"><span>FIND US</span><span>GUANGZHOU, CHINA</span></div>
        <div className="cp-location__grid">
          <h2 id="location-title">COME FIND<br /><span>OUR TEAM.</span></h2>
          <div className="cp-location__address">
            <div className="cp-section-label"><span aria-hidden="true" /> OUR ADDRESS</div>
            <address>Liangjia Technology Building<br />No. 170 Donghuan Rd, Shiqiao Street<br />Guangzhou, China</address>
            <a className="cp-text-link cp-text-link--dark" href="mailto:sarah@ljsportstech.com">CONTACT OUR TEAM <ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>
        </div>
      </section>
    </main>
  );
}
