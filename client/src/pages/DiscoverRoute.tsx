import InteriorLayout from "@/components/InteriorLayout";
import { pageMeta } from "@/page-meta";
import DiscoverPage from "./DiscoverPage";

export default function DiscoverRoute() {
  return (
    <InteriorLayout
      active={pageMeta.discover.path}
      title={pageMeta.discover.title}
      description={pageMeta.discover.description}
    >
      <DiscoverPage />
    </InteriorLayout>
  );
}
