import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { projects, site } from "../content/index.js";
import { Button, Media, Reveal, SiteLink } from "../components/primitives.jsx";
import "./ProjectPage.css";

const META = [["status", "Status"], ["category", "Type"], ["role", "Role"], ["timeline", "Timeline"], ["year", "Year"], ["team", "Team"]];

/** Case study page, rendered from content/projects/<order>-<slug>.md */
export default function ProjectPage() {
  const { slug } = useParams();
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  useEffect(() => {
    document.title = project ? `${project.title} — ${site.name}` : site.meta.title;
    return () => { document.title = site.meta.title; };
  }, [project]);

  if (!project) {
    return (
      <main className="case case--missing container">
        <p className="label">(404)</p>
        <h1 className="text-section">Project not found</h1>
        <Button href="/#projects" label="Back to work" />
      </main>
    );
  }

  return (
    <main className="case">
      <header className="container case__head">
        <SiteLink href="/#projects" className="label case__back" wave="← All projects" />
        <h1 className="case__title">{project.title}</h1>
        {project.summary && <p className="text-lead muted case__summary">{project.summary}</p>}
        <dl className="case__meta">
          {META.filter(([k]) => project[k]).map(([k, label]) => (
            <div key={k}><dt className="label">{label}</dt><dd>{project[k]}</dd></div>
          ))}
        </dl>
        {project.tags?.length > 0 && <ul className="case__tags">{project.tags.map((t) => <li className="chip" key={t}>{t}</li>)}</ul>}
      </header>

      <div className="container">
        <Reveal className="case__cover"><Media src={project.cover} alt={project.title} /></Reveal>
      </div>

      <article className="container case__body">
        <div className="case__prose" dangerouslySetInnerHTML={{ __html: project.html }} />
        {project.link && <div className="case__live"><Button href={project.link} label="Visit live site" /></div>}
      </article>

      {project.gallery?.length > 0 && (
        <div className="container case__gallery">
          {project.gallery.map((src, i) => <Reveal key={src} index={i % 2}><Media src={src} alt="" /></Reveal>)}
        </div>
      )}

      {next && next.slug !== project.slug && (
        <SiteLink href={`/work/${next.slug}`} className="case__next container" data-hw="">
          <span className="label">(NEXT PROJECT)</span>
          <span className="case__next-title">{next.title} <span aria-hidden="true">→</span></span>
        </SiteLink>
      )}
    </main>
  );
}
