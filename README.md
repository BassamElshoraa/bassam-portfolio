# Bassam Portfolio

Professional portfolio for **Bassam El-Shoraa**, Data Analyst, Business Intelligence specialist, forecasting practitioner, and Data Instructor.

The website presents interactive Power BI reports, scrollable Python notebooks and SQL files, professional experience, credentials, articles, and paid analytics services. Its content dashboard works locally or on the published site with a limited GitHub token.

## Live website

The production site is deployed automatically to GitHub Pages:

`https://bassamelshoraa.github.io/bassam-portfolio/`

## Main features

- Responsive dark and light themes using the Cairo font.
- 32 analytics and business intelligence projects.
- Embedded interactive Power BI reports.
- GitHub-backed viewers for `.ipynb`, `.py`, and `.sql` project files, with saved notebook results shown before the code.
- Project search and technology filters.
- Professional experience, education, and certification sections.
- Locally cached article reader, independent of Medium availability.
- Paid-services catalogue and a direct FormSubmit request form with email fallback.
- Content dashboard for projects, articles, skills, services, experience, credentials, visual design, source files, media, and backups.
- Direct route documents and metadata for every project and article.
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

## Editing from any device

1. Open the [published dashboard](https://bassamelshoraa.github.io/bassam-portfolio/dashboard/).
2. Create a **fine-grained personal access token** in GitHub Settings. Limit repository access to `BassamElshoraa/bassam-portfolio` and set **Contents: Read and write**. No broader scope is needed.
3. Enter the token in the dashboard. It stays in page memory only, not local storage or repository files. Refreshing or closing the tab ends the session.
4. Edit the content, visual settings, media, or source files and save. The dashboard creates a Git commit on `main`; GitHub Pages publishes it shortly afterward. A save message means the commit succeeded, not that deployment has already finished. Source edits can break a build, so check the Actions status and change one file at a time.
5. Sign out when done, and revoke the token in GitHub Settings if you no longer need it.

Do not paste a token into messages, screenshots, or shared devices. Publishing from the dashboard requires permission to push to this repository. If the branch is protected, GitHub will reject the commit instead of silently storing changes in the browser.

## Local editing workflow

1. Open the local dashboard at `http://127.0.0.1:4173/dashboard`.
2. Edit projects, articles, skills, services, profile, presentation, experience, education, or certifications.
3. Save changes. The local server writes them to the project files.
4. Review the portfolio locally.
5. Commit and push the changes to `main`.
6. GitHub Actions rebuilds and publishes the new version automatically.

The local dashboard and published dashboard edit the same JSON content schema. GitHub Pages itself remains a static site; remote saves go through the GitHub API and Actions deployment.

## Content and assets

- `public/data/portfolioProjects.json` — project catalogue and links.
- `public/data/siteContent.json` — profile, services, experience, education, and certifications.
- `public/data/articles.json` — local copies of article content and cover paths.
- `public/image/project` — project thumbnails and uploads.
- `public/image/personal` — original and optimized profile photography.
- `src/portfolio` — active portfolio and dashboard components.

## Project presentation rules

- **Power BI:** the live report is embedded directly in the project page.
- **Python:** saved notebook results, charts, tables, and optional code are shown without running arbitrary Python on the website.
- **SQL:** only SQL files are shown.
- **Other projects:** a focused case-study overview is shown.

## Service requests

The request form sends directly through [FormSubmit](https://formsubmit.co/documentation) without opening a visitor's email application. The first request triggers a one-time activation email to `Bassam.m.elshoraa@gmail.com`; Bassam must confirm that address before delivery is active. The form shows a success message only after FormSubmit confirms the request, retains the visitor's input on failure, and offers direct email and copy options as fallbacks. Form submissions pass through the FormSubmit service; no private key is stored in the site.

## Quality checks

```bash
npm run lint
npm run build:pages
npm run verify:pages
```

The deployment workflow also runs a clean install and `npm run build:pages` before every GitHub Pages release.

## Repository hygiene

Generated builds, dependencies, local environment files, temporary files, and backup archives are excluded from Git. All source code, configuration, content JSON, images, resume, local dashboard, and deployment workflow are included.

## Contact

- LinkedIn: [linkedin.com/in/bassam-elshoraa](https://www.linkedin.com/in/bassam-elshoraa/)
- GitHub: [github.com/BassamElshoraa](https://github.com/BassamElshoraa)
- Medium: [bassamelshoraa.medium.com](https://bassamelshoraa.medium.com/)
- Email: `Bassam.m.elshoraa@gmail.com`
