import { useCallback, useEffect, useState } from 'react';
import './AdminDashboard.css';
import './AdminResearchPapers.css';

const API = 'http://localhost/portfoliojulaskka/api';

const emptyPaper = {
  title: '',
  authors: '',
  publication_title: '',
  publication_year: '',
  doi: '',
  abstract: '',
  paper_url: '',
  status: 'draft',
};

export default function AdminResearchPapers() {
  const [admin, setAdmin] = useState(null);
  const [papers, setPapers] = useState([]);
  const [form, setForm] = useState({ ...emptyPaper });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const loadPapers = useCallback(async () => {
    const response = await fetch(
      `${API}/admin-research-papers.php`,
      { credentials: 'include' }
    );

    const data = await response.json();

    if (response.status === 401) {
      window.location.href = '/admin-login';
      return;
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Unable to load papers.');
    }

    setPapers(data.papers || []);
  }, []);

  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        const response = await fetch(
          `${API}/admin-session.php`,
          { credentials: 'include' }
        );

        if (response.status === 401) {
          window.location.href = '/admin-login';
          return;
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error('Unable to verify admin session.');
        }

        if (active) {
          setAdmin(data.admin);
          await loadPapers();
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to load papers.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    initialize();

    return () => {
      active = false;
    };
  }, [loadPapers]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm(current => ({
      ...current,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm({ ...emptyPaper });
    setEditingId(null);
  }

  function editPaper(paper) {
    setForm({
      title: paper.title || '',
      authors: paper.authors || '',
      publication_title: paper.publication_title || '',
      publication_year: paper.publication_year || '',
      doi: paper.doi || '',
      abstract: paper.abstract || '',
      paper_url: paper.paper_url || '',
      status: paper.status || 'draft',
    });

    setEditingId(Number(paper.id));
    setMessage('');
    setError('');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function savePaper(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        ...form,
        publication_year: form.publication_year || null,
      };

      if (editingId) payload.id = editingId;

      const response = await fetch(
        `${API}/admin-research-papers.php`,
        {
          method: editingId ? 'PUT' : 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = '/admin-login';
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to save paper.');
      }

      setMessage(data.message || 'Paper saved successfully.');
      resetForm();
      await loadPapers();
    } catch (err) {
      setError(err.message || 'Unable to save paper.');
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(paper) {
    setMessage('');
    setError('');

    try {
      const updatedPaper = {
        title: paper.title || '',
        authors: paper.authors || '',
        publication_title: paper.publication_title || '',
        publication_year: paper.publication_year || null,
        doi: paper.doi || '',
        abstract: paper.abstract || '',
        paper_url: paper.paper_url || '',
        status: paper.status === 'published' ? 'draft' : 'published',
        id: Number(paper.id),
      };

      const response = await fetch(
        `${API}/admin-research-papers.php`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPaper),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = '/admin-login';
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to change status.');
      }

      setMessage(
        updatedPaper.status === 'published'
          ? 'Paper published successfully.'
          : 'Paper moved to drafts.'
      );

      await loadPapers();
    } catch (err) {
      setError(err.message || 'Unable to change status.');
    }
  }

  async function deletePaper(paper) {
    const confirmed = window.confirm(
      `Permanently delete "${paper.title}"?`
    );

    if (!confirmed) return;

    setMessage('');
    setError('');

    try {
      const response = await fetch(
        `${API}/admin-research-papers.php`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(paper.id) }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = '/admin-login';
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to delete paper.');
      }

      if (editingId === Number(paper.id)) resetForm();

      setMessage('Research paper deleted.');
      await loadPapers();
    } catch (err) {
      setError(err.message || 'Unable to delete paper.');
    }
  }

  async function logout() {
    try {
      await fetch(`${API}/admin-logout.php`, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      window.location.href = '/admin-login';
    }
  }

  const visiblePapers = papers.filter(
    paper => filter === 'all' || paper.status === filter
  );

  if (loading) {
    return (
      <div className="admin-loading">
        Loading research papers...
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/">
          J<span>.</span>
          <small>PORTFOLIO ADMIN</small>
        </a>

        <div className="admin-nav-label">WORKSPACE</div>

        <a className="admin-nav-item" href="/admin-dashboard">
          <span>▦</span> Projects
        </a>

        <a
          className="admin-nav-item active"
          href="/admin-dashboard?view=papers"
        >
          <span>▤</span> Research Papers
        </a>

        <a
          className="admin-nav-item"
          href="/"
          target="_blank"
          rel="noreferrer"
        >
          <span>↗</span> View portfolio
        </a>

        <div className="admin-sidebar-bottom">
          <div className="admin-avatar">
            {(admin?.name || 'A').charAt(0).toUpperCase()}
          </div>

          <div className="admin-user">
            <strong>{admin?.name || 'Administrator'}</strong>
            <span>Administrator</span>
          </div>

          <button
            className="admin-logout"
            onClick={logout}
            title="Log out"
            aria-label="Log out"
          >
            ↗
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-eyebrow">
              PORTFOLIO MANAGEMENT
            </span>
            <h1>Research papers</h1>
            <p>
              Add publications and choose which papers appear
              on your public portfolio.
            </p>
          </div>

          <button
            className="admin-primary-button"
            onClick={() => {
              resetForm();
              setMessage('');
              setError('');
              document.getElementById('paper-editor')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            + New paper
          </button>
        </header>

        {message && (
          <div className="admin-alert success">{message}</div>
        )}

        {error && (
          <div className="admin-alert error">{error}</div>
        )}

        <section className="admin-stats">
          <article className="admin-stat-card">
            <span>Total papers</span>
            <strong>{papers.length}</strong>
            <small>All saved papers</small>
          </article>

          <article className="admin-stat-card">
            <span>Published</span>
            <strong>
              {papers.filter(p => p.status === 'published').length}
            </strong>
            <small>Visible publicly</small>
          </article>

          <article className="admin-stat-card">
            <span>Drafts</span>
            <strong>
              {papers.filter(p => p.status === 'draft').length}
            </strong>
            <small>Not publicly visible</small>
          </article>
        </section>

        <section className="admin-editor-panel" id="paper-editor">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-eyebrow">
                {editingId ? 'UPDATE PUBLICATION' : 'ADD PUBLICATION'}
              </span>
              <h2>
                {editingId ? 'Edit research paper' : 'Add a research paper'}
              </h2>
            </div>

            {editingId && (
              <button
                className="admin-text-button"
                type="button"
                onClick={resetForm}
              >
                Cancel editing
              </button>
            )}
          </div>

          <form className="admin-project-form" onSubmit={savePaper}>
            <div className="admin-form-grid">
              <label className="admin-full-width">
                Paper title *
                <input
                  name="title"
                  value={form.title}
                  onChange={updateField}
                  required
                  maxLength={255}
                  placeholder="Full title of the paper"
                />
              </label>

              <label>
                Authors
                <input
                  name="authors"
                  value={form.authors}
                  onChange={updateField}
                  placeholder="J. Olaniyan, A. Researcher"
                />
              </label>

              <label>
                Journal / conference
                <input
                  name="publication_title"
                  value={form.publication_title}
                  onChange={updateField}
                  placeholder="Journal or conference name"
                />
              </label>

              <label>
                Publication year
                <input
                  name="publication_year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  value={form.publication_year}
                  onChange={updateField}
                  placeholder="2026"
                />
              </label>

              <label>
                DOI
                <input
                  name="doi"
                  value={form.doi}
                  onChange={updateField}
                  placeholder="10.xxxx/xxxxx"
                />
              </label>

              <label className="admin-full-width">
                Abstract / summary
                <textarea
                  name="abstract"
                  value={form.abstract}
                  onChange={updateField}
                  rows={5}
                  placeholder="Summarise the paper and its contribution."
                />
              </label>

              <label className="admin-full-width">
                Paper URL
                <input
                  name="paper_url"
                  type="url"
                  value={form.paper_url}
                  onChange={updateField}
                  placeholder="https://publisher.org/paper"
                />
                <small>
                  Enter a publisher page or a direct PDF URL.
                  This version links to existing files; it does not upload PDFs.
                </small>
              </label>

              <label>
                Status
                <select
                  name="status"
                  value={form.status}
                  onChange={updateField}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
            </div>

            <div className="admin-form-actions">
              <button
                type="button"
                className="admin-secondary-button"
                onClick={resetForm}
              >
                Clear form
              </button>

              <button
                type="submit"
                className="admin-primary-button"
                disabled={saving}
              >
                {saving
                  ? 'Saving...'
                  : editingId
                    ? 'Save changes'
                    : 'Add paper'}
              </button>
            </div>
          </form>
        </section>

        <section className="admin-projects-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-eyebrow">
                SCHOLARLY CONTENT
              </span>
              <h2>
                All research papers <span>{papers.length}</span>
              </h2>
            </div>

            <select
              className="admin-filter"
              value={filter}
              onChange={event => setFilter(event.target.value)}
              aria-label="Filter papers"
            >
              <option value="all">All papers</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>

          {visiblePapers.length === 0 ? (
            <div className="admin-empty-state">
              <span>✳</span>
              <h3>No research papers found</h3>
              <p>Add your first paper or change the filter.</p>
              <button
                className="admin-primary-button"
                onClick={resetForm}
              >
                Add a paper
              </button>
            </div>
          ) : (
            <div className="admin-project-list">
              {visiblePapers.map(paper => (
                <article className="admin-project-row" key={paper.id}>
                  <div className="admin-paper-icon">PAPER</div>

                  <div className="admin-project-info">
                    <div className="admin-project-title-line">
                      <h3>{paper.title}</h3>
                    </div>

                    <p>
                      {paper.authors ||
                        paper.publication_title ||
                        paper.abstract ||
                        'No summary provided.'}
                    </p>

                    <div className="admin-project-meta">
                      <span
                        className={`admin-status ${
                          paper.status === 'published'
                            ? 'published'
                            : 'draft'
                        }`}
                      >
                        {paper.status}
                      </span>

                      {paper.publication_year && (
                        <span>{paper.publication_year}</span>
                      )}

                      <span>ID: {paper.id}</span>
                    </div>
                  </div>

                  <div className="admin-project-actions">
                    <button
                      className="admin-secondary-button"
                      onClick={() => editPaper(paper)}
                    >
                      Edit
                    </button>

                    <button
                      className="admin-secondary-button"
                      onClick={() => changeStatus(paper)}
                    >
                      {paper.status === 'published'
                        ? 'Unpublish'
                        : 'Publish'}
                    </button>

                    <button
                      className="admin-danger-button"
                      onClick={() => deletePaper(paper)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="admin-footer">
          Julius Olaniyan · Portfolio administration
          <a href="/" target="_blank" rel="noreferrer">
            View public site ↗
          </a>
        </footer>
      </main>
    </div>
  );
}
