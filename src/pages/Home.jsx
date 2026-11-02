import { site } from "../content/index.js";
import Hero from "../sections/Hero.jsx";
import SignalExplorer from "../sections/SignalExplorer.jsx";
import About from "../sections/About.jsx";
import Clients from "../sections/Clients.jsx";
import Projects from "../sections/Projects.jsx";
import Lab from "../sections/Lab.jsx";
import Skills from "../sections/Skills.jsx";
import Contact from "../sections/Contact.jsx";

// Section ids used in content/site.md -> `sections`.
const SECTIONS = { hero: Hero, explorer: SignalExplorer, about: About, clients: Clients, projects: Projects, lab: Lab, skills: Skills, contact: Contact };

export default function Home() {
  return (
    <main>
      {site.sections.map((id) => {
        const Section = SECTIONS[id];
        return Section ? <Section key={id} /> : null;
      })}
    </main>
  );
}
