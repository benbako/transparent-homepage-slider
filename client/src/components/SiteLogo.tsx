const managedLogo = "/manus-storage/lj-sports-refined-web_a471bb92.webp";
const fallbackLogo = "/assets/lj-sports-refined-web.webp";

export default function SiteLogo() {
  return (
    <img
      src={managedLogo}
      alt="LJ Sports Tech"
      width="1600"
      height="900"
      onError={event => {
        const image = event.currentTarget;
        if (image.getAttribute("src") !== fallbackLogo) image.src = fallbackLogo;
      }}
    />
  );
}
