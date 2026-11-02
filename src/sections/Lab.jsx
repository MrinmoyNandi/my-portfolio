import { lab } from "../content/index.js";
import { Button, Media, Reveal } from "../components/primitives.jsx";
import "./Lab.css";

export default function Lab() {
  return (
    <section id="lab" className="section lab">
      <div className="container">
        <div className="lab__head">
          {lab.heading && <Reveal as="h2" index={1} className="text-section">{lab.heading}</Reveal>}
        </div>
        <div className="lab__grid">
          {lab.items.map((item, i) => (
            <Reveal className="lab__item" index={i} key={item.image + i}>
              <div className="lab__media"><Media src={item.image} alt={item.alt ?? ""} /></div>
              {item.title && <h3 className="text-lead lab__title">{item.title}</h3>}
              <p className="muted">{item.text}</p>
            </Reveal>
          ))}
        </div>
        {lab.buttons?.length > 0 && (
          <Reveal className="lab__buttons" index={2}>
            {lab.buttons.map((b) => <Button key={b.label} href={b.href} label={b.label} />)}
          </Reveal>
        )}
      </div>
    </section>
  );
}
