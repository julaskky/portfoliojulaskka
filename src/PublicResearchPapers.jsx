import { useEffect, useState } from 'react';
import './PublicResearchPapers.css';

const API =
  'http://localhost/portfoliojulaskka/api/research-papers.php';

export default function PublicResearchPapers() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    fetch(API, { signal: controller.signal })
      .then(async response => {
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error('Unable to load papers.');
        }

        setPapers(data.papers || []);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError('Research papers are temporarily unavailable.');
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  function getDoiUrl(doi) {
    if (!doi) return '';

    if (/^https?:\/\//i.test(doi)) {
      return doi;
    }

    return `https://doi.org/${doi.replace(/^doi:\s*/i, '')}`;
  }

  return (
    <section className="public-papers-section" id="research-papers">
      <div className="public-papers-heading">
        <span className="public-papers-kicker">
          RESEARCH & PUBLICATIONS
        </span>

        <h2>Research that moves ideas forward.</h2>

        <p>
          Explore my research papers, scholarly contributions,
          and publications.
        </p>
      </div>

      {loading && (
        <p className="public-papers-message">
          Loading published papers...
        </p>
      )}

      {!loading && error && (
        <p className="public-papers-message">{error}</p>
      )}

      {!loading && !error && papers.length === 0 && (
        <p className="public-papers-message">
          Published research papers will appear here soon.
        </p>
      )}

      {!loading && !error && papers.length > 0 && (
        <div className="public-papers-grid">
          {papers.map(paper => (
            <article className="public-paper-card" key={paper.id}>
              <div className="public-paper-meta">
                {paper.publication_year && (
                  <span>{paper.publication_year}</span>
                )}

                {paper.publication_title && (
                  <span>{paper.publication_title}</span>
                )}
              </div>

              <h3>{paper.title}</h3>

              {paper.authors && (
                <p className="public-paper-authors">
                  {paper.authors}
                </p>
              )}

              {paper.abstract && (
                <p className="public-paper-abstract">
                  {paper.abstract}
                </p>
              )}

              <div className="public-paper-links">
                {paper.paper_url && (
                  <a
                    href={paper.paper_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Read paper ↗
                  </a>
                )}

                {paper.doi && (
                  <a
                    href={getDoiUrl(paper.doi)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View DOI ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
