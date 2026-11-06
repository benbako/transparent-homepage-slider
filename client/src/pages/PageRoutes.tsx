import InteriorLayout from "@/components/InteriorLayout";
import { pageMeta } from "@/page-meta";
import ExperiencesPage from "./ExperiencesPage";
import SolutionsPage from "./SolutionsPage";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";

export function ExperiencesRoute() {
  return <InteriorLayout active={pageMeta.experiences.path} title={pageMeta.experiences.title} description={pageMeta.experiences.description}><ExperiencesPage /></InteriorLayout>;
}
export function SolutionsRoute() {
  return <InteriorLayout active={pageMeta.solutions.path} title={pageMeta.solutions.title} description={pageMeta.solutions.description}><SolutionsPage /></InteriorLayout>;
}
export function AboutRoute() {
  return <InteriorLayout active={pageMeta.about.path} title={pageMeta.about.title} description={pageMeta.about.description}><AboutPage /></InteriorLayout>;
}
export function ContactRoute() {
  return <InteriorLayout active={pageMeta.contact.path} title={pageMeta.contact.title} description={pageMeta.contact.description}><ContactPage /></InteriorLayout>;
}
