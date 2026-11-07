import InteriorLayout from "@/components/InteriorLayout";
import { pageMeta } from "@/page-meta";
import ServicesPage from "./ServicesPage";

export function ServicesRoute() {
  return <InteriorLayout active="/services.html" title={pageMeta.services.title} description={pageMeta.services.description}>
    <ServicesPage />
  </InteriorLayout>;
}
