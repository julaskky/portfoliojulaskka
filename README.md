# Professional Portfolio – Dr. Julius Olaniyan

### Academic Research | Artificial Intelligence | Machine Learning | Software Engineering | Technology Innovation

A professional portfolio website showcasing academic qualifications, research contributions, technical expertise, software engineering projects, scholarly publications, teaching experience, and professional achievements.

The platform is designed to provide universities, research institutions, technology organisations, recruiters, and potential collaborators with a centralised view of my academic and professional profile.

---

## 1. About the Portfolio

This portfolio represents my professional journey as a Computer Scientist, Lecturer, Researcher, and Artificial Intelligence and Machine Learning specialist.

My work focuses on developing intelligent computational systems, conducting interdisciplinary research, advancing applied artificial intelligence, and translating research innovations into practical technological solutions.

The portfolio provides a structured presentation of my academic background, research interests, publications, technical capabilities, teaching experience, and selected software development projects.

It also serves as a professional contact point for academic appointments, research collaborations, consulting engagements, and technology-related opportunities.

## 2. Professional Profile

**Dr. Julius Olaniyan, PhD**

Computer Scientist | AI/ML Researcher | Lecturer | Deep Learning Engineer | Research Scientist

### Research and Technical Interests

- Artificial Intelligence and Machine Learning
- Deep Learning and Neural Networks
- Graph Neural Networks and Graph Representation Learning
- Transformer Architectures and Large Language Models
- Explainable Artificial Intelligence
- Computer Vision and Image Analysis
- Natural Language Processing
- Speech and Multilingual Technologies
- NeuroAI and Intelligent Computational Systems
- Intelligent Educational Systems
- Predictive Analytics and Decision Support Systems

### Application Domains

My research and development interests span several application areas, including:

- Healthcare and biomedical intelligence.
- Financial technology and fraud detection.
- Education and learning analytics.
- Agriculture and intelligent farming.
- Cybersecurity and risk analytics.
- Climate and environmental intelligence.
- Multilingual communication technologies.

## 3. Portfolio Objectives

The website is designed to:

1. Establish a professional digital presence.
2. Showcase academic qualifications and research experience.
3. Present scholarly publications and research contributions.
4. Demonstrate technical competencies and practical projects.
5. Communicate teaching and academic experience.
6. Support professional networking and research collaboration.
7. Provide direct access to professional contact information and relevant academic profiles.

## 4. Website Sections

The portfolio is organised around the following professional information areas, subject to the current implementation.

### Professional Introduction

An overview of my professional identity, academic background, research orientation, and technical specialisations.

### About Me

A detailed professional biography highlighting academic development, research experience, teaching activities, and career objectives.

### Education and Qualifications

A presentation of academic qualifications, including:

- PhD in Computer Science – Landmark University.
- M.Tech in Computer Science – Federal University of Technology, Akure.
- Postgraduate Diploma in Computer Science – Federal University of Technology, Akure.
- B.Sc. in Computer Science – Federal University Oye-Ekiti.

### Research Interests

An overview of research areas involving artificial intelligence, machine learning, deep learning, graph learning, natural language processing, computer vision, explainable AI, and intelligent computational systems.

### Publications

A professional presentation of scholarly contributions, including research publications indexed in international academic databases.

### Projects and Technical Work

A showcase of software engineering and applied research projects demonstrating the practical implementation of computational methods and intelligent systems.

### Teaching and Academic Experience

An overview of teaching experience, academic responsibilities, research supervision interests, and relevant courses.

### Professional Contact

A contact section for academic appointments, research collaborations, consulting opportunities, and professional engagements.

---

## 5. Technology Stack

The project is built using a modern frontend and PHP backend architecture.

| Technology | Purpose |
|---|---|
| React | Component-based frontend development |
| Vite | Development server and production build tooling |
| JavaScript | Application logic and interactivity |
| HTML5 | Web document structure |
| CSS3 | Responsive styling and presentation |
| PHP | Backend application functionality |
| REST-oriented API | Frontend/backend communication |
| npm | Dependency management |
| Git | Source control and version management |

The project also uses ESLint configuration to support code quality and consistency.

---

## 6. Application Architecture

The application follows a modular web architecture separating the frontend interface from backend functionality.

```text
                VISITOR
                   |
                   v
          +-------------------+
          |  React Frontend   |
          |                   |
          | Portfolio Pages   |
          | Navigation        |
          | UI Components     |
          | Responsive Design |
          +-------------------+
                   |
                   | HTTP Requests
                   v
          +-------------------+
          |    PHP API        |
          |                   |
          | Request Handling  |
          | Server-side Logic |
          | Data Processing   |
          +-------------------+
                   |
                   v
          +-------------------+
          | Configuration /   |
          | Data Services      |
          +-------------------+
```

This architecture provides a foundation for maintaining frontend presentation independently from server-side functionality.

---

## 7. Repository Structure

The project follows this repository organisation:

```text
portfoliojulaskka/
│
├── api/                    # PHP backend endpoints
│
├── config/                 # Application configuration
│
├── public/                 # Public static assets
│
├── src/                    # React application source
│
├── index.html              # Frontend HTML entry point
│
├── package.json            # Project dependencies and scripts
│
├── package-lock.json       # Dependency lock file
│
├── vite.config.js          # Vite configuration
│
├── eslint.config.js        # ESLint configuration
│
├── .gitignore              # Git exclusion rules
│
├── README.md               # Project documentation
│
└── README.txt              # Additional project notes
```

---

## 8. Local Development Setup

### Prerequisites

The following software is required:

- Node.js.
- npm.
- PHP.
- Apache web server.
- XAMPP or an equivalent local PHP development environment.
- Git.

Verify the installations:

```bash
node --version
npm --version
php --version
git --version
```

### Step 1: Clone the Repository

```bash
git clone https://github.com/julaskky/portfoliojulaskka.git
```

Navigate into the project directory:

```bash
cd portfoliojulaskka
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs the frontend dependencies declared in `package.json`.

### Step 3: Configure the Backend

For local XAMPP development, place the project under:

```text
C:\xampp\htdocs\portfoliojulaskka
```

Start Apache through the XAMPP Control Panel.

Review the `api/` and `config/` directories and configure any required backend settings.

### Step 4: Start the Frontend

Run:

```bash
npm run dev
```

Vite will display the development server address, typically:

```text
http://localhost:5173/
```

Open the displayed address in your browser.

### Step 5: Access the Backend

The local PHP application directory is accessible through:

```text
http://localhost/portfoliojulaskka/api/
```

The actual API endpoints depend on the backend implementation.

---

## 9. Available Development Commands

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Generate the production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run linting, if configured:

```bash
npm run lint
```

---

## 10. Production Deployment

The frontend can be prepared for deployment using Vite's production build process.

Execute:

```bash
npm run build
```

The generated production assets are placed in:

```text
dist/
```

For production deployment:

1. Configure the web server to serve the generated frontend assets.
2. Deploy the PHP backend to a PHP-compatible hosting environment.
3. Configure the correct API base URL.
4. Configure environment-specific settings.
5. Enable HTTPS.
6. Verify frontend-to-backend communication.
7. Test navigation, page loading, and contact functionality.
8. Configure appropriate caching and security headers.

The production environment should not expose private configuration files, development credentials, or internal application details.

---

## 11. Code Quality and Maintenance

The project uses a modular React architecture intended to support maintainability and future extension.

Development practices include:

- Reusable frontend components.
- Separation of application logic and presentation.
- Consistent naming conventions.
- Responsive interface design.
- Structured backend endpoints.
- Dependency management through npm.
- Source control through Git.
- Code quality checks through ESLint.

---

## 12. Security Considerations

Security is important even for professional portfolio applications.

Recommended practices include:

- Never commit private credentials or `.env` files.
- Validate server-side input.
- Protect backend configuration files.
- Restrict access to administrative operations where applicable.
- Use HTTPS in production.
- Avoid exposing internal server errors.
- Keep dependencies updated.
- Apply appropriate CORS and HTTP security policies.
- Validate uploaded documents and media if upload functionality is implemented.

---

## 13. Professional and Academic Profiles

The portfolio complements my established academic and professional profiles.

| Platform | Profile |
|---|---|
| ORCID | [0000-0003-4340-4606](https://orcid.org/0000-0003-4340-4606) |
| Google Scholar | [Academic Publications](https://scholar.google.com/citations?user=n_BBr5sAAAAJ) |
| Scopus | Author ID: 58308056100 |

These profiles provide additional information about scholarly publications, research contributions, and academic activities.

---

## 14. Future Development

Potential enhancements include:

- Dynamic publication management.
- Research project administration.
- Interactive project demonstrations.
- Downloadable academic CV.
- Research collaboration enquiry forms.
- Blog and research updates.
- Advanced publication filtering.
- Search engine optimisation.
- Analytics and visitor insights.
- Content management functionality.
- Integration with academic profile services.

These are possible future enhancements and are not necessarily part of the current implementation.

---

## 15. Repository

**Project:** Professional Portfolio – Dr. Julius Olaniyan

**GitHub Repository:** https://github.com/julaskky/portfoliojulaskka

**Local Development Path:**

```text
C:\xampp\htdocs\portfoliojulaskka
```

---

## 16. Professional Statement

My professional interests lie at the intersection of computer science, artificial intelligence, machine learning, research innovation, and practical technology development.

Through academic research, teaching, software engineering, and interdisciplinary collaboration, I aim to contribute to the development of intelligent computational solutions that address meaningful challenges across different sectors.

This portfolio serves as a central platform for communicating those contributions, documenting professional growth, and facilitating collaboration with academic institutions, research groups, technology organisations, and industry partners.

---

**Dr. Julius Olaniyan, PhD**

Computer Scientist | Lecturer | AI/ML Researcher | Software Developer

*Research. Innovation. Intelligent Systems.*
