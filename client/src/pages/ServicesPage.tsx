import { ArrowDown, ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import "./services-page.css";

const services = [
  {
    number: "01",
    title: "Venue & store planning",
    description:
      "Discuss your space, equipment placement and operational needs as you plan your venue or store.",
  },
  {
    number: "02",
    title: "Ecommerce & marketing",
    description:
      "Explore ecommerce and marketing guidance to help you think through how to reach your audience.",
  },
  {
    number: "03",
    title: "Products & support",
    description:
      "Ask about product availability and the support available for the equipment you are considering.",
  },
];

const questions = [
  {
    question: "What trade terms are available?",
    answer:
      "Trade and delivery terms can vary by order and destination. Contact the team to discuss the current terms for your project.",
  },
  {
    question: "What warranty applies to the equipment?",
    answer:
      "Warranty coverage can depend on the product and order. Ask the team to confirm the current coverage and conditions for your chosen equipment.",
  },
  {
    question: "How long does production take?",
    answer:
      "Production lead times can vary by product, quantity and order requirements. Please confirm the current estimate with the team before ordering.",
  },
  {
    question: "What payment terms do you accept?",
    answer:
      "Payment methods and terms may vary. Contact the team for the current options and details for your order.",
  },
  {
    question: "How is equipment packed?",
    answer:
      "Packing requirements can vary with the equipment and shipment. Ask the team about the packing arrangements for your order.",
  },
];

export default function ServicesPage() {
  return (
    <main id="top" className="services-page">
      <section className="services-hero services-gutter" aria-labelledby="services-title">
        <div className="services-hero__copy">
          <div className="services-eyebrow"><span aria-hidden="true" /> LJ SERVICES</div>
          <h1 id="services-title">SUPPORT FOR<br /><span>YOUR NEXT</span><br />MOVE<span className="services-blue">.</span></h1>
          <p>
            From planning your space to exploring products, we are here to help
            you find the right next step.
          </p>
          <div className="services-hero__actions">
            <a className="services-button services-button--blue" href="/contact">
              TALK TO THE TEAM <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a className="services-text-link services-text-link--light" href="#faq">
              VIEW FAQ <ArrowDown size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
        <figure className="services-hero__figure">
          <div className="services-hero__image">
            <img src="/assets/skiing.webp" alt="A person using an interactive skiing simulator" />
          </div>
          <figcaption><span>SPORT × TECHNOLOGY × PLAY</span><span>LJ SPORTS TECH</span></figcaption>
        </figure>
        <div className="services-hero__bottom">
          <span>IDEAS. EQUIPMENT. SUPPORT.</span>
          <a href="#catalog">REQUEST THE PRODUCT CATALOG <ArrowDown size={14} aria-hidden="true" /></a>
        </div>
      </section>

      <section className="services-offer services-gutter" aria-labelledby="services-offer-title">
        <div className="services-eyebrow services-eyebrow--dark"><span aria-hidden="true" /> HOW WE CAN HELP</div>
        <div className="services-offer__intro">
          <h2 id="services-offer-title">A LITTLE GUIDANCE.<br /><span>A BIGGER IDEA.</span></h2>
          <p>
            Every project is different. Talk with us about your plans and the
            support that makes sense for your space and business.
          </p>
        </div>
        <div className="services-offer__grid">
          {services.map((service) => (
            <article className="services-offer__item" key={service.number}>
              <span className="services-offer__number">{service.number} /</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
        <a className="services-text-link services-text-link--dark" href="/solutions">
          EXPLORE VENUE SOLUTIONS <ArrowRight size={18} aria-hidden="true" />
        </a>
      </section>

      <section id="faq" className="services-faq services-gutter" aria-labelledby="services-faq-title">
        <div className="services-faq__intro">
          <div>
            <div className="services-eyebrow"><span aria-hidden="true" /> COMMON QUESTIONS</div>
            <h2 id="services-faq-title">THE DETAILS<br /><span>MATTER.</span></h2>
          </div>
          <p>
            Terms and availability can change. For up-to-date details, please
            confirm them with our team.
          </p>
        </div>
        <div className="services-faq__list">
          {questions.map((item) => (
            <details className="services-faq__item" key={item.question}>
              <summary>
                <span>{item.question}</span>
                <Plus size={20} aria-hidden="true" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
        <a className="services-text-link services-text-link--light" href="/contact">
          ASK US A QUESTION <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </section>

      <section id="catalog" className="services-catalog services-gutter" aria-labelledby="services-catalog-title">
        <div className="services-catalog__top">
          <span>LOOKING FOR PRODUCT INFORMATION?</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </div>
        <div className="services-catalog__content">
          <h2 id="services-catalog-title">LET'S FIND<br /><span>YOUR FIT.</span></h2>
          <div>
            <p>
              Tell us what you are looking for and request the product catalog
              from the LJ team.
            </p>
            <a className="services-button services-button--dark" href="mailto:business@ljsportstech.com?subject=Product%20catalog%20request">
              REQUEST THE PRODUCT CATALOG <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
