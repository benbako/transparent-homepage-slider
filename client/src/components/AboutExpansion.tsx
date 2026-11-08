import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import "./about-expansion.css";

type AboutExpansionProps = {
  scene: ReactNode;
};

const guidingIdeas = [
  {
    title: "Stay curious",
    description:
      "Keep asking what makes a game engaging, and explore how digital tools can add something new to the experience.",
  },
  {
    title: "Welcome people in",
    description:
      "Think about the people entering the space, from friends trying an activity for the first time to visitors returning for another challenge.",
  },
  {
    title: "Think through the details",
    description:
      "Pay attention to the whole experience, from how equipment fits a room to how the pieces come together on site.",
  },
];

const designSteps = [
  {
    title: "Understand the space",
    description:
      "Start with the room, the people who may use it and the kind of experience you have in mind. Space, activity and the way people move between areas all matter.",
  },
  {
    title: "Visualize and plan",
    description:
      "Designers can use 3D renderings to explore equipment layout and help you picture how the space could come together.",
  },
  {
    title: "Bring it together",
    description:
      "Consider the equipment and customization options for the project, with installation support from LJ as the plan moves into the venue.",
  },
];

export default function AboutExpansion({ scene }: AboutExpansionProps) {
  return (
    <div className="aboutx">
      <section className="aboutx-mission aboutx-gutter" aria-labelledby="aboutx-mission-title">
        <div className="aboutx-kicker"><span aria-hidden="true" /> OUR MISSION</div>
        <div className="aboutx-mission-grid">
          <h2 id="aboutx-mission-title">MORE ROOM<br />FOR <span>MOVEMENT.</span></h2>
          <div className="aboutx-mission-copy">
            <p className="aboutx-lead">Make sports easier. Make room for play.</p>
            <p>We bring sports and technology together to make movement feel inviting. That could mean an interactive tennis rally, a football challenge or a taste of skiing indoors—a new way to move and have fun.</p>
          </div>
        </div>
        <div className="aboutx-mission-note">
          <span>SPORT <span aria-hidden="true">×</span> TECHNOLOGY <span aria-hidden="true">×</span> PLAY</span>
          <p>Product suitability and age guidance vary by experience.</p>
        </div>
      </section>

      <section className="aboutx-values aboutx-gutter" aria-labelledby="aboutx-values-title">
        <div className="aboutx-values-intro">
          <div>
            <div className="aboutx-kicker aboutx-kicker--dark"><span aria-hidden="true" /> DESIGN VALUES</div>
            <h2 id="aboutx-values-title">GOOD PLAY<br /><span>STARTS HERE.</span></h2>
          </div>
          <p>Three ideas to consider when bringing people, equipment and spaces together.</p>
        </div>
        <div className="aboutx-values-grid">
          {guidingIdeas.map((idea, index) => (
            <article className="aboutx-value" key={idea.title}>
              <div className="aboutx-value-top"><span>0{index + 1}</span><span aria-hidden="true">↗</span></div>
              <h3>{idea.title}</h3>
              <p>{idea.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="aboutx-design aboutx-gutter" aria-labelledby="aboutx-design-title">
        <div className="aboutx-design-grid">
          <div className="aboutx-design-copy">
            <div className="aboutx-kicker"><span aria-hidden="true" /> DESIGNING THE EXPERIENCE</div>
            <h2 id="aboutx-design-title">SEE THE SPACE<br /><span>TAKE SHAPE.</span></h2>
            <p>Every project starts with different possibilities. A compact activity zone, a family entertainment venue or a larger sports space each has its own people, layout and equipment needs.</p>
          </div>
          <div className="aboutx-scene">{scene}</div>
        </div>
        <div className="aboutx-process-heading">
          <h3>From idea to installation support</h3>
          <p>A practical way to plan a place for play.</p>
        </div>
        <ol className="aboutx-steps">
          {designSteps.map((step, index) => (
            <li className="aboutx-step" key={step.title}>
              <span className="aboutx-step-number">0{index + 1} /</span>
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
        <a className="aboutx-link" href="/experiences">
          EXPLORE EXPERIENCES <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </section>
    </div>
  );
}
