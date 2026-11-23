import { useEffect, useState } from 'react';
import './App.css';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminResearchPapers from './AdminResearchPapers';
import PublicResearchPapers from './PublicResearchPapers';

const API_URL =
  'http://localhost/portfoliojulaskka/api/projects.php';

const interests = [
  'Machine Learning',
  'Deep Learning',
  'Large Language Models',
  'AI4Cybersecurity',
  'NeuroAI',
  'AI for Healthcare',
  'Explainable AI',
  'Natural Language Processing',
  'AI for Education',
];

const tones = ['lavender', 'mint', 'peach'];

function ArrowUpRight() {
  return <span aria-hidden="true" className="arrow">↗</span>;
}

function getTechnologies(value) {
  if (Array.isArray(value)) return value;

  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value.split(',').map(item => item.trim()).filter(Boolean);
    }
  }

  return [];
}

function getInitials(title = '') {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();
}

function PublicPortfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectError, setProjectError] = useState('');

  const email = 'julius.olaniyan@ufred.ca';

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      try {
        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Unable to load portfolio projects.');
        }

        const data = await response.json();

        if (!data.success || !Array.isArray(data.projects)) {
          throw new Error('The projects API returned an invalid response.');
        }

        setProjects(data.projects);
        setProjectError('');
      } catch (error) {
        if (error.name !== 'AbortError') {
          setProjectError(
            'Projects could not be loaded. Please try refreshing the page.'
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => controller.abort();
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <div className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="site-header wrap">
        <a className="brand" href="#home" aria-label="Home">
          <span className="brand-mark">J<span>.</span></span>
          <span className="brand-name">
            Julius Olaniyan
            <small>RESEARCH · TECHNOLOGY · INNOVATION</small>
          </span>
        </a>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#work" onClick={() => setMenuOpen(false)}>Projects</a>
          <a href="#research" onClick={() => setMenuOpen(false)}>Research</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <a className="nav-cta" href="#work">
            Explore my work <ArrowUpRight />
          </a>
        </nav>
      </header>

      <main>
        <section className="hero wrap" id="home">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" />
              INDEPENDENT THINKER. PRACTICAL BUILDER.
            </div>

            <h1>
              Turning bold ideas<br />
              into <span className="gradient-text">meaningful</span><br />
              technology.
            </h1>

            <p className="hero-description">
              I'm Julius Olaniyan — an AI researcher, educator, and
              software developer exploring how intelligent systems can
              solve real-world problems.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#work">
                Discover my projects <ArrowUpRight />
              </a>
              <a className="button button-quiet" href="#about">
                A little about me <span>↓</span>
              </a>
            </div>

            <div className="hero-footnote">
              <span className="mini-line" />
              Building at the intersection of research and real-world impact
            </div>
          </div>

          <div className="hero-art" aria-label="Abstract technology artwork">
            <div className="art-orbit orbit-a" />
            <div className="art-orbit orbit-b" />
            <div className="art-orbit orbit-c" />

            <div className="art-core">
              <span className="core-spark">✳</span>
              <span className="core-label">IDEAS → IMPACT</span>
            </div>

            <div className="float-card float-card-top">
              <span className="float-icon purple">✳</span>
              <span>
                <b>Artificial Intelligence</b>
                <small>Research & discovery</small>
              </span>
            </div>

            <div className="float-card float-card-bottom">
              <span className="float-icon green">⌘</span>
              <span>
                <b>Software Engineering</b>
                <small>From concept to product</small>
              </span>
            </div>

            <span className="art-star star-one">✳</span>
            <span className="art-star star-two">✧</span>
            <span className="art-cross cross-one">+</span>
          </div>

          <div className="hero-index">
            <span>01 / 04</span>
            <span className="index-rule" />
            <span>PORTFOLIO · {new Date().getFullYear()}</span>
          </div>
        </section>

        <section className="proof-strip">
          <div className="wrap proof-inner">
            <span className="proof-label">MY WORLD, IN A FEW WORDS</span>
            <div>
              <b>Research</b>
              <span>Questions worth asking</span>
            </div>
            <div>
              <b>Engineering</b>
              <span>Ideas worth building</span>
            </div>
            <div>
              <b>Education</b>
              <span>Knowledge worth sharing</span>
            </div>
          </div>
        </section>

        <section className="section wrap about-section" id="about">
          <div className="section-heading">
            <span className="section-kicker">
              01 — THE PERSON BEHIND THE WORK
            </span>
            <h2>
              Curiosity is the starting point.<br />
              <span className="muted-heading">
                Impact is the ambition.
              </span>
            </h2>
          </div>

          <div className="about-grid">
            <div className="about-photo">
              <img
                src="/images/julius-olaniyan.jpg"
                alt="Julius Olaniyan"
              />
              <span>RESEARCHER · EDUCATOR · DEVELOPER</span>
            </div>

            <div className="about-details">
              <h3>About Dr. Julius Olaniyan</h3>

              <p>
                Artificial Intelligence Research Scientist and Postdoctoral Fellow with expertise spanning Machine Learning, Deep Learning, Graph Neural Networks, Natural Language Processing, Explainable AI, Computer Vision, Speech Technologies, NeuroAI, and Intelligent Educational Systems. Recognized for developing innovative AI-driven solutions addressing complex challenges in healthcare, finance, education, agriculture, cybersecurity, and multilingual communication..
              </p>

              <p>
                Author of 50+ Scopus- and IEEE-indexed publications, with extensive experience designing Transformer-based architectures, attention-enhanced neural networks, hybrid AI systems, and explainable machine learning frameworks. Successfully translated cutting-edge research into practical applications, including intelligent grading systems, multilingual speech translation, fraud detection, medical diagnosis, educational technologies, and climate-related AI solutions.
              </p>

              <p>
                Experienced university educator and researcher with a proven record of undergraduate and postgraduate teaching, curriculum development, research supervision, and international collaboration across multiple higher education institutions. Passionate about interdisciplinary research that combines artificial intelligence with real-world societal challenges while mentoring the next generation of AI researchers.
              </p>
		<p>
		Recognized for strong analytical thinking, scientific leadership, collaborative research, and a commitment to developing responsible, explainable, and impactful AI systems aligned with global research priorities.
		</p>
              <a className="text-link" href="#contact">
                Let's connect <ArrowUpRight />
              </a>
            </div>
          </div>
        </section>

	
	
{/* EDUCATIONAL BACKGROUND */}
<section className="education-section" id="education">
  <div className="section-eyebrow">ACADEMIC JOURNEY</div>
  <h2>Educational Background</h2>
  <p className="section-intro">
    My academic journey reflects a commitment to learning,
    research, innovation, and the application of technology
    to real-world challenges.
  </p>

  <div className="education-list">
    <article className="education-card">
      <span className="education-marker">01</span>
      <div>
        <h3>Doctorate Degree | 2023 </h3>
        <p className="education-institution">
          Landmark University, Omu-Aran, Kwara State, Nigeria.
        </p>
        <p>
          PhD in Computer Science with specialization in Artificial Intelligence and Machine Learning.
        </p>
      </div>
    </article>

    <article className="education-card">
      <span className="education-marker">02</span>
      <div>
        <h3>Master's Degree | 2019</h3>
        <p className="education-institution">
          Federal University of Technology Akure, Ondo State, Nigeria.
        </p>
        <p>
          Masters of Technology (MTech.) - Computer Science with specialization in Computational Linguistics, Machine Learning and Natural Language Processing.
        </p>
      </div>
    </article>

    <article className="education-card">
      <span className="education-marker">03</span>
      <div>
        <h3>Bachelor's Degree | 2023</h3>
        <p className="education-institution">
          Federal University of Oye-Ekiti, Ekiti State, Nigeria
        </p>
        <p>
          BSC- Computer Science with specialization is Software Computing.
        </p>
      </div>
    </article>

	<article className="education-card">
      <span className="education-marker">04</span>
      <div>
        <h3>Diploma | 2008</h3>
        <p className="education-institution">
          Auchi Polytechnic, Auchi, Edo State, Nigeria
        </p>
        <p>
          Higher National Diploma (HND) - Computer Science.
        </p>
      </div>
    </article>
	

	<article className="education-card">
      <span className="education-marker">05</span>
      <div>
        <h3>Diploma | 2002</h3>
        <p className="education-institution">
          Auchi Polytechnic, Auchi, Edo State, Nigeria
        </p>
        <p>
          National Diploma (ND) - Computer Science.
        </p>
      </div>
    </article>



  </div>
</section>






{/* WORK EXPERIENCE */}
<section className="experience-section" id="experience">
  <div className="section-eyebrow">CAREER & PROFESSIONAL IMPACT</div>
  <h2>Work Experience</h2>
  <p className="section-intro">
    My professional experience brings together teaching,
    research, software development, and technology innovation.
  </p>

  <div className="experience-list">
    <article className="experience-card">
      <div className="experience-period">2026</div>
      <div>
        <h3>Subject Matter Expert</h3>
        <p className="experience-organization">
          University of Fredericton (UFred), Canada.
        </p>
        <p>
          (1) Contribute specialized expertise in software engineering principles, methodologies, requirements engineering, software development processes, project management, software quality, security, and professional practice.
	  (2) Develop and review course learning outcomes, course structure, weekly topics, instructional content, learning activities, and assessment strategies in alignment with programme-level learning objectives.
	  (3) Collaborate with UFred academic and instructional teams to ensure academically rigorous, industry-relevant, and pedagogically effective course content.
	  (4) Provide expert guidance on the design and organization of course materials, including readings, interactive learning resources, case studies, discussion activities, and assessments
.
        </p>
      </div>
    </article>

    <article className="experience-card">
      <div className="experience-period">2025</div>
      <div>
        <h3>Postdoctoral Research Fellow</h3>
        <p className="experience-organization">
          Sol Plaatje University, Kimberley, South Africa
        </p>
        <p>
          Spearhead interdisciplinary AI research in intelligent assessment, multilingual speech technologies, healthcare AI, and data-driven decision support systems, while co-supervising Honours and Master’s research and mentoring students in advanced AI methodologies. Publish high-impact research in internationally recognized Scopus- and IEEE-indexed journals and conferences.
        </p>
      </div>
    </article>


     <article className="experience-card">
      <div className="experience-period">2024</div>
      <div>
        <h3>Lecturer I</h3>
        <p className="experience-organization">
          Bowen University, Iwo, Nigeria
        </p>
        <p>
          Delivered undergraduate and postgraduate courses in Programming, Mobile Computing, Information Storage, Software Engineering, and Quality Assurance; supervised undergraduate, Master’s, and PhD research projects; and contributed to curriculum development, assessment coordination, and departmental research through collaborative supervision and publication, demonstrating excellence in teaching, student mentorship, and research collaboration.
        </p>
      </div>
    </article>


	<article className="experience-card">
      <div className="experience-period">2023</div>
      <div>
        <h3>Assistant Lecturer & Lecturer II</h3>
        <p className="experience-organization">
          Landmark University, Omu-Aran, Kwara State, Nigeria
        </p>
        <p>
          Taught core Computer Science courses, including Programming, Data Structures, Algorithms, Data Mining, Computer Architecture, and Information Systems, while mentoring undergraduate researchers, coordinating departmental seminars, supporting curriculum delivery, and contributing to AI-focused research initiatives, AI education, and academic leadership.
        </p>
      </div>
    </article>

    
	<article className="experience-card">
      <div className="experience-period">2013</div>
      <div>
        <h3>Data Processing Officer/System Analyst</h3>
        <p className="experience-organization">
          Auchi Polytechnic, Auchi, Edo State, Nigeria
        </p>
        <p>
          Managed institutional information systems to ensure data integrity, security, and efficient academic record management, while automating reporting and analytics processes and collaborating with multidisciplinary teams to enhance operational efficiency and support strategic decision-making through technology-driven solutions.
        </p>
      </div>
    </article>


	<article className="experience-card">
      <div className="experience-period">2009</div>
      <div>
        <h3>Application Developer/Business Developer</h3>
        <p className="experience-organization">
          Feghas Solutions Ltd, Lagos, Nigeria 
        </p>
        <p>
          Developed web, desktop, and mobile software solutions across the full software development lifecycle, designing secure, scalable applications and RESTful services while applying software engineering best practices and collaborating with cross-functional teams to deliver high-quality solutions aligned with business requirements.
        </p>
      </div>
    </article>


	<article className="experience-card">
      <div className="experience-period">2008</div>
      <div>
        <h3>Application Developer/ Tutor</h3>
        <p className="experience-organization">
          Pesoka System Ltd, Ajaokuta, Kogi State, Nigeria
        </p>
        <p>
          Developed various software applications such as web, desktop, and mobile software solutions across the full software development lifecycle, designing secure, scalable applications and RESTful services while applying software engineering best practices and collaborating with cross-functional teams to deliver high-quality solutions aligned with business requirements.
        </p>
      </div>
    </article>



  </div>
</section>








        <section className="section work-section" id="work">
          <div className="wrap">
            <div className="section-topline">
              <span className="section-kicker">02 — SELECTED WORK</span>
              <span className="section-aside">
                A growing collection of ideas made real.
              </span>
            </div>

            <div className="work-title-row">
              <h2>
                Built with purpose<span className="gradient-text">.</span>
              </h2>
              <span className="project-count">
                {String(projects.length).padStart(2, '0')}
                {' '}<i>PROJECTS</i>
              </span>
            </div>

            {loading && (
              <p role="status" className="project-message">
                Loading projects from the portfolio database...
              </p>
            )}

            {!loading && projectError && (
              <div className="project-message" role="alert">
                <p>{projectError}</p>
                <button
                  className="button button-primary"
                  onClick={() => window.location.reload()}
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !projectError && projects.length === 0 && (
              <p className="project-message">
                New projects are coming soon. Please check back again.
              </p>
            )}

            {!loading && !projectError && projects.length > 0 && (
              <div className="project-grid">
                {projects.map((project, index) => {
                  const tags = getTechnologies(project.technologies);
                  const tone = tones[index % tones.length];

                  return (
                    <article className="project-card" key={project.id}>
                      <div className={`project-visual ${tone}`}>
                        <div className="project-visual-top">
                          <span>
                            {Number(project.featured)
                              ? 'Featured project'
                              : project.category || 'Portfolio project'}
                          </span>
                          <span>{String(index + 1).padStart(2, '0')}</span>
                        </div>

                        {project.image_path ? (
                          <img
                            className="project-image"
                            src={`http://localhost/portfoliojulaskka/${String(
                              project.image_path
                            ).replace(/^\/+/, '')}`}
                            alt={`${project.title} preview`}
                            loading="lazy"
                          />
                        ) : (
                          <div className="project-monogram">
                            {getInitials(project.title)}
                          </div>
                        )}

                        <div className="visual-lines">
                          <i />
                          <i />
                          <i />
                        </div>
                        <span className="visual-orb" />
                      </div>

                      <div className="project-content">
                        <span className="project-type">
                          {project.category || 'Software application'}
                        </span>

                        <h3>{project.title}</h3>

                        <p>
                          {project.short_description ||
                            project.description ||
                            'Explore this application and its features.'}
                        </p>

                        {tags.length > 0 && (
                          <div className="tag-list">
                            {tags.map(tag => (
                              <span key={tag}>{tag}</span>
                            ))}
                          </div>
                        )}

                        {project.description &&
                          project.description !== project.short_description && (
                            <details className="project-details">
                              <summary>More about this project</summary>
                              <p>{project.description}</p>
                            </details>
                          )}

                        <div className="project-actions">
                          {project.live_url && (
                            <a
                              className="project-link"
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Live demo <ArrowUpRight />
                            </a>
                          )}

                          {project.github_url && (
                            <a
                              className="project-link"
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              GitHub <ArrowUpRight />
                            </a>
                          )}

                          {!project.live_url && !project.github_url && (
                            <a className="project-link" href="#contact">
                              Discuss this project <ArrowUpRight />
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            <div className="work-foot">
              <span>MORE EXPERIMENTS. MORE THINGS TO COME.</span>
              <span className="work-foot-line" />
            </div>
          </div>
        </section>

        <section className="section wrap research-section" id="research">
          <div className="research-intro">
            <span className="section-kicker">
              03 — RESEARCH & EXPERTISE
            </span>
            <h2>
              Exploring the questions<br />
              that <span className="gradient-text">move us forward.</span>
            </h2>
            <p>
              My interests centre on building intelligent, useful, and
              responsible systems — with an emphasis on practical
              applications and human impact.
            </p>
            <a className="text-link" href="#contact">
              Explore a collaboration <ArrowUpRight />
            </a>
          </div>

          <div className="interest-panel">
            <div className="interest-panel-head">
              <span>AREAS OF INTEREST</span>
              <span>↘</span>
            </div>

            <div className="interest-list">
              {interests.map((item, index) => (
                <div className="interest-item" key={item}>
                  <span className="interest-number">
                    0{index + 1}
                  </span>
                  <span>{item}</span>
                  <ArrowUpRight />
                </div>
              ))}
            </div>

            <div className="interest-bottom">
              Always learning. Always questioning. Always building.
            </div>
          </div>
        </section>
	
	<PublicResearchPapers />




        <section className="contact-band" id="contact">
          <div className="wrap contact-inner">
            <div>
              <span className="section-kicker">
                04 — HAVE AN IDEA IN MIND?
              </span>
              <h2>
                Let's make something<br />
                <span className="gradient-text">that matters.</span>
              </h2>
              <p>
                Open to thoughtful collaborations, research conversations,
                and ambitious ideas.
              </p>
            </div>

            <div className="contact-actions">
              <a className="button button-primary" href={`mailto:${email}`}>
                Start a conversation <ArrowUpRight />
              </a>
              <button className="copy-email" onClick={copyEmail}>
                {emailCopied ? 'Email copied ✓' : `${email}  ↗`}
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer wrap">
        <a className="footer-brand" href="#home">J<span>.</span></a>
	 <a href="/admin-login">Admin Login</a> 
        <span>
          © {new Date().getFullYear()} Julius Olaniyan. Thoughtfully built.
        </span>
        <div className="footer-links">
          <a href="#home">Back to top ↑</a>
          <a href="#work">Projects</a>
          <a href="#contact">Contact</a>
        </div>
      </footer>
    </div>
  );
}


export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  switch (path) {
    case '/admin-login':
      return <AdminLogin />;

    case '/admin-dashboard':
      return new URLSearchParams(window.location.search).get('view') === 'papers'
        ? <AdminResearchPapers />
        : <AdminDashboard />;

    default:
      return <PublicPortfolio />;
  }
}
