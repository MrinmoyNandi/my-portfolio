import { clients } from "../content/index.js";
import { Media, Reveal } from "../components/primitives.jsx";
import "./Clients.css";

/** Two name marquees in opposite directions; pauses on hover. */
export default function Clients() {
  return (
    <section id="clients" className="clients">
      <div className="container clients__grid">
        {clients.reel && (
          <Reveal className="clients__reel">
            <Media src={clients.reel} alt="" />
          </Reveal>
        )}
        <div className="clients__rows">
          {clients.rows.map((row, r) => (
            <div className="marquee" key={r} data-reverse={r % 2 === 1}>
              <div className="marquee__track" style={{ "--dur": `${38 + r * 8}s` }}>
                {[0, 1].map((copy) => (
                  <ul className="marquee__group" key={copy} aria-hidden={copy === 1}>
                    {row.map((name) => <li key={name} className="text-project">{name}<span className="marquee__dot" aria-hidden="true">✦</span></li>)}
                  </ul>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
