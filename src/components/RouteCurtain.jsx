import { site } from "../content/index.js";
import { useSite } from "../lib/SiteProvider.jsx";
import "./RouteCurtain.css";

/** Magenta panel that slides up over the page while the route changes, then off the top. */
export default function RouteCurtain() {
  const { curtain } = useSite();
  return (
    <div className="curtain" data-route-curtain={curtain} aria-hidden="true">
      <span className="curtain__mark">{site.wordmark}</span>
    </div>
  );
}
