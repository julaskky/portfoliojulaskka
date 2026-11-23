
import { useCallback, useEffect, useState } from 'react';
import './AdminDashboard.css';

const API = 'http://localhost/portfoliojulaskka/api';
const emptyProject = {
  title: '',
  slug: '',
  short_description: '',
  description: '',
  technologies: '',
  image_path: '',
  live_url: '',
  github_url: '',
  category: '',
  status: 'draft',
  featured: false,
};

function normalizeProject(project) {
  let technologies = project.technologies || [];

  if (typeof technologies === 'string') {
    try {
      technologies = JSON.parse(technologies);
    } catch {
      technologies = technologies.split(',').map(item => item.trim());
    }
  }

  return {
    ...emptyProject,
    ...project,
    technologies: Array.isArray(technologies)
      ? technologies.join(', ')
      : '',
    featured: Boolean(Number(project.featured)),
  };
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyProject);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const loadProjects = useCallback(async () => {
    const response = await fetch(`${API}/admin-projects.php`, {
      credentials: 'include',
    });
    const data = await response.json();

    if (response.status === 401) {
      window.location.href = '/admin-login';
      return;
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Unable to load projects.');
    }

    setProjects(data.projects || []);
  }, []);

  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        const response = await fetch(`${API}/admin-session.php`, {
          credentials: 'include',
        });

        if (response.status === 401) {
          window.location.href = '/admin-login';
          return;
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Unable to verify your session.');
        }

        if (active) {
          setAdmin(data.admin);
          await loadProjects();
        }
      } catch (err) {
        if (active) setError(err.message || 'Unable to load the dashboard.');
      } finally {
        if (active) setLoading(false);
      }
    }

    initialize();

    return () => {
      active = false;
    };
  }, [loadProjects]);

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm(current => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function startNewProject() {
    setForm(emptyProject);
    setEditingId(null);
    setMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function editProject(project) {
    setForm(normalizeProject(project));
    setEditingId(project.id);
    setMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function saveProject(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    const payload = {
      ...form,
      technologies: form.technologies
        .split(',')
        .map(item => item.trim())
        .filter(Boolean),
      featured: form.featured ? 1 : 0,
    };

    try {
      const response = await fetch(`${API}/admin-projects.php`, {
        method: editingId ? 'PUT' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          ...(editingId ? { id: editingId } : {}),
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = '/admin-login';
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to save this project.');
      }

      setMessage(data.message || 'Project saved successfully.');
      setForm(emptyProject);
      setEditingId(null);
      await loadProjects();
    } catch (err) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(project) {
    const updated = normalizeProject(project);
    updated.status = project.status === 'published' ? 'draft' : 'published';

    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API}/admin-projects.php`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updated,
          technologies: updated.technologies
            .split(',')
            .map(item => item.trim())
            .filter(Boolean),
          id: project.id,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = '/admin-login';
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to change project status.');
      }

      setMessage(
        updated.status === 'published'
          ? 'Project published.'
          : 'Project moved to drafts.'
      );

      await loadProjects();
    } catch (err) {
      setError(err.message || 'Unable to change project status.');
    }
  }

  async function deleteProject(project) {
    const confirmed = window.confirm(
      `Delete "${project.title}" permanently? This cannot be undone.`
    );

    if (!confirmed) return;

    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API}/admin-projects.php`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: project.id }),
      });

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = '/admin-login';
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to delete this project.');
      }

      if (editingId === project.id) startNewProject();

      setMessage('Project deleted successfully.');
      await loadProjects();
    } catch (err) {
      setError(err.message || 'Unable to delete this project.');
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

  const visibleProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  });

  if (loading) {
    return <div className="admin-loading">Loading your dashboard...</div>;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/">
          J<span>.</span>
          <small>PORTFOLIO ADMIN</small>
        </a>

        <div className="admin-nav-label">WORKSPACE</div>
        <a className="admin-nav-item active" href="#projects">
          <span>▦</span> Projects
        </a>

	<a className="admin-nav-item" href="/admin-dashboard?view=papers">
  		<span>▤</span> Research Papers
	</a>

        <a className="admin-nav-item" href="/" target="_blank" rel="noreferrer">
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
          <button className="admin-logout" onClick={logout} title="Log out">
            ↗
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-eyebrow">PORTFOLIO MANAGEMENT</span>
            <h1>Projects workspace</h1>
            <p>Manage the work displayed on your public portfolio.</p>
          </div>

          <button className="admin-primary-button" onClick={startNewProject}>
            + New project
          </button>
        </header>

        {message && <div className="admin-alert success">{message}</div>}
        {error && <div className="admin-alert error">{error}</div>}

        <section className="admin-stats">
          <article className="admin-stat-card">
            <span>Total projects</span>
            <strong>{projects.length}</strong>
            <small>All saved projects</small>
          </article>
          <article className="admin-stat-card">
            <span>Published</span>
            <strong>
              {projects.filter(project => project.status === 'published').length}
            </strong>
            <small>Visible on your portfolio</small>
          </article>
          <article className="admin-stat-card">
            <span>Drafts</span>
            <strong>
              {projects.filter(project => project.status === 'draft').length}
            </strong>
            <small>Not publicly visible</small>
          </article>
        </section>

        <section className="admin-editor-panel" id="project-editor">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-eyebrow">
                {editingId ? 'UPDATE YOUR WORK' : 'ADD SOMETHING NEW'}
              </span>
              <h2>{editingId ? 'Edit project' : 'Create a project'}</h2>
            </div>
            {editingId && (
              <button className="admin-text-button" onClick={startNewProject}>
                Cancel editing
              </button>
            )}
          </div>

          <form className="admin-project-form" onSubmit={saveProject}>
            <div className="admin-form-grid">
              <label>
                Project title *
                <input
                  name="title"
                  value={form.title}
                  onChange={updateField}
                  required
                  maxLength={255}
                  placeholder="e.g. AI Research Assistant"
                />
              </label>

              <label>
                URL slug
                <input
                  name="slug"
                  value={form.slug}
                  onChange={updateField}
                  placeholder="ai-research-assistant (auto-generated if blank)"
                />
              </label>

              <label>
                Category
                <input
                  name="category"
                  value={form.category}
                  onChange={updateField}
                  placeholder="AI, Research, Web Application..."
                />
              </label>

              <label>
                Technologies
                <input
                  name="technologies"
                  value={form.technologies}
                  onChange={updateField}
                  placeholder="React, PHP, MySQL"
                />
                <small>Separate technologies with commas.</small>
              </label>

              <label className="admin-full-width">
                Short description
                <textarea
                  name="short_description"
                  value={form.short_description}
                  onChange={updateField}
                  rows={2}
                  placeholder="A concise summary for the project card."
                />
              </label>

              <label className="admin-full-width">
                Full description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  rows={5}
                  placeholder="Describe the problem, solution, and key features."
                />
              </label>

              <label className="admin-full-width">
                Project image path
                <input
                  name="image_path"
                  value={form.image_path}
                  onChange={updateField}
                  placeholder="uploads/projects/project-image.jpg"
                />
                <small>
                  Enter a path relative to your portfolio folder. Leave blank
                  to use the generated project artwork.
                </small>
              </label>

              <label>
                Live demo URL
                <input
                  name="live_url"
                  type="url"
                  value={form.live_url}
                  onChange={updateField}
                  placeholder="https://example.com"
                />
              </label>

              <label>
                GitHub URL
                <input
                  name="github_url"
                  type="url"
                  value={form.github_url}
                  onChange={updateField}
                  placeholder="https://github.com/username/project"
                />
              </label>

              <label>
                Publication status
                <select
                  name="status"
                  value={form.status}
                  onChange={updateField}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>

              <label className="admin-featured-option">
                <input
                  name="featured"
                  type="checkbox"
                  checked={form.featured}
                  onChange={updateField}
                />
                <span>
                  <strong>Featured project</strong>
                  <small>Give this project priority in the list.</small>
                </span>
              </label>
            </div>

            <div className="admin-form-actions">
              <button
                type="button"
                className="admin-secondary-button"
                onClick={startNewProject}
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
                    : 'Create project'}
              </button>
            </div>
          </form>
        </section>

        <section className="admin-projects-panel" id="projects">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-eyebrow">YOUR PORTFOLIO CONTENT</span>
              <h2>All projects <span>{projects.length}</span></h2>
            </div>

            <select
              className="admin-filter"
              value={filter}
              onChange={event => setFilter(event.target.value)}
              aria-label="Filter projects by status"
            >
              <option value="all">All projects</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>

          {visibleProjects.length === 0 ? (
            <div className="admin-empty-state">
              <span>✳</span>
              <h3>No projects found</h3>
              <p>Add your first project or change the current filter.</p>
              <button className="admin-primary-button" onClick={startNewProject}>
                Create a project
              </button>
            </div>
          ) : (
            <div className="admin-project-list">
              {visibleProjects.map(project => (
                <article className="admin-project-row" key={project.id}>
                  <div className="admin-project-icon">
                    {project.image_path ? (
                      <img
                        src={`http://localhost/portfoliojulaskka/${String(
                          project.image_path
                        ).replace(/^\/+/, '')}`}
                        alt=""
                      />
                    ) : (
                      (project.title || 'P').slice(0, 2).toUpperCase()
                    )}
                  </div>

                  <div className="admin-project-info">
                    <div className="admin-project-title-line">
                      <h3>{project.title}</h3>
                      {Number(project.featured) === 1 && (
                        <span className="admin-featured-badge">Featured</span>
                      )}
                    </div>
                    <p>
                      {project.short_description ||
                        project.category ||
                        'No short description provided.'}
                    </p>
                    <div className="admin-project-meta">
                      <span
                        className={`admin-status ${
                          project.status === 'published' ? 'published' : 'draft'
                        }`}
                      >
                        {project.status}
                      </span>
                      <span>ID: {project.id}</span>
                    </div>
                  </div>

                  <div className="admin-project-actions">
                    <button
                      className="admin-secondary-button"
                      onClick={() => editProject(project)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-secondary-button"
                      onClick={() => changeStatus(project)}
                    >
                      {project.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      className="admin-danger-button"
                      onClick={() => deleteProject(project)}
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
          <a href="/" target="_blank" rel="noreferrer">View public site ↗</a>
        </footer>
      </main>
    </div>
  );
}
