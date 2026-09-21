# Bassam Portfolio

Professional portfolio for **Bassam El-Shoraa**, Data Analyst, Business Intelligence specialist, forecasting practitioner, and Data Instructor.

The website presents interactive Power BI reports, scrollable Python notebooks and SQL files, professional experience, credentials, Medium articles, and paid analytics services. It also includes a local content dashboard for maintaining the portfolio without editing source files manually.

## Live website

The production site is deployed automatically to GitHub Pages:

`https://bassamelshoraa.github.io/bassam-portfolio/`

## Main features

- Responsive dark and light themes using the Cairo font.
- 32 analytics and business intelligence projects.
- Embedded interactive Power BI reports.
- GitHub-style viewers for `.ipynb`, `.py`, and `.sql` project files.
- Project search and technology filters.
- Professional experience, education, and certification sections.
- Medium article reader.
- Paid-services catalogue and structured email request form.
- Local dashboard for adding, editing, deleting, and reordering portfolio content.
- Automated GitHub Pages deployment after every push to `main`.

## Technology

- React 19
- Vite 6
- React Router
- Lucide icons
- Local JSON content files
- GitHub REST API for public repository code previews
- GitHub Actions and GitHub Pages

## Run locally

### One-click launcher on Windows

Double-click `OPEN_PORTFOLIO.bat`.

The launcher installs dependencies when required, builds the website, starts the local content server, and opens Microsoft Edge.

- Portfolio: `http://127.0.0.1:4173/`
- Content dashboard: `http://127.0.0.1:4173/dashboard`

### Terminal

```bash
npm install
npm run local
```

For development:

```bash
npm run dev
```

## Editing workflow

1. Open the local dashboard at `http://127.0.0.1:4173/dashboard`.
2. Edit projects, services, profile, experience, education, or certifications.
3. Save changes. The local server writes them to the project files.
4. Review the portfolio locally.
5. Commit and push the changes to `main`.
6. GitHub Actions rebuilds and publishes the new version automatically.

The public GitHub Pages site is static. Its dashboard is not used for production editing; permanent edits are made through the local dashboard and then published.

## Content and assets

- `public/data/portfolioProjects.json` — project catalogue and links.
- `public/data/siteContent.json` — profile, services, experience, education, and certifications.
- `public/image/project` — project thumbnails and uploads.
- `public/image/personal` — profile photography.
- `public/Bassam_Elshoraa_resume.pdf` — downloadable resume.
- `src/portfolio` — active portfolio and dashboard components.

## Project presentation rules

- **Power BI:** the live report is embedded directly in the project page.
- **Python:** only notebook and Python code files are shown.
- **SQL:** only SQL files are shown.
- **Other projects:** a focused case-study overview is shown.

## Service requests

The current request form prepares a structured email addressed to `Bassam.m.elshoraa@gmail.com` and opens the visitor's email application for review and sending. A hosted form provider or serverless endpoint can be connected later if direct background delivery is required.

## Quality checks

```bash
npm run lint
npm run build
```

The deployment workflow also runs a clean install and `npm run build:pages` before every GitHub Pages release.

## Repository hygiene

Generated builds, dependencies, local environment files, temporary files, and backup archives are excluded from Git. All source code, configuration, content JSON, images, resume, local dashboard, and deployment workflow are included.

## Contact

- LinkedIn: [linkedin.com/in/bassam-elshoraa](https://www.linkedin.com/in/bassam-elshoraa/)
- GitHub: [github.com/BassamElshoraa](https://github.com/BassamElshoraa)
- Medium: [bassamelshoraa.medium.com](https://bassamelshoraa.medium.com/)
- Email: `Bassam.m.elshoraa@gmail.com`
