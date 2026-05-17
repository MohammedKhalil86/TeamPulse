import { Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/components/section-card/section-card.component';

@Component({
  selector: 'tp-run-locally-page',
  standalone: true,
  imports: [AccordionModule, ButtonModule, PanelModule, SectionCardComponent, PageHeaderComponent, TabsModule, TagModule],
  template: `
    <tp-page-header
      eyebrow="Learning Lab / Run Locally"
      title="Run Locally"
      subtitle="Everything you need to clone TeamPulse, run the backend and frontend, and understand the GitHub Pages static build."
    />

    <tp-section-card title="Data notice" subtitle="Please read before running the project.">
      <div class="notice-body">
        <p-tag value="Sample data only" severity="warn" />
        <p>
          TeamPulse uses sample workspace data. Do not enter real employee or company information. All data is stored in browser localStorage or in-memory on the local API process and is not transmitted anywhere.
        </p>
      </div>
    </tp-section-card>

    <p-tabs value="local">
      <p-tablist>
        <p-tab value="local"><i class="pi pi-desktop"></i> Local Setup</p-tab>
        <p-tab value="github-pages"><i class="pi pi-globe"></i> GitHub Pages</p-tab>
        <p-tab value="troubleshooting"><i class="pi pi-wrench"></i> Troubleshooting</p-tab>
      </p-tablist>

      <p-tabpanels>

        <!-- LOCAL SETUP TAB -->
        <p-tabpanel value="local">
          <tp-section-card title="Repository" subtitle="Clone the project from GitHub.">
            <div class="code-block-group">
              <p class="step-label">GitHub repository</p>
              <pre><code>https://github.com/MohammedKhalil86/TeamPulse</code></pre>
              <pre><code>git clone https://github.com/MohammedKhalil86/TeamPulse.git
cd TeamPulse</code></pre>
            </div>
          </tp-section-card>

          <tp-section-card title="Requirements" subtitle="Install these tools before running the project.">
            <div class="requirements-grid">
              <div class="req-item">
                <span class="req-name">Git</span>
                <span class="req-note">Any recent version. Needed to clone the repository.</span>
              </div>
              <div class="req-item">
                <span class="req-name">Node.js LTS</span>
                <span class="req-note">Use a version supported by Angular 21. Node.js 22 LTS or Node.js 24 LTS both work. The project was set up with Node.js 24 LTS.</span>
              </div>
              <div class="req-item">
                <span class="req-name">npm</span>
                <span class="req-note">Comes with Node.js. npm 10 or npm 11 works. Run <code>npm -v</code> to check your version.</span>
              </div>
              <div class="req-item">
                <span class="req-name">Angular CLI (optional)</span>
                <span class="req-note">Install globally for the <code>ng</code> command. Not required — all npm scripts work without it.</span>
                <pre><code>npm install -g &#64;angular/cli&#64;21.2.9</code></pre>
              </div>
              <div class="req-item">
                <span class="req-name">.NET SDK</span>
                <span class="req-note">Required for the local backend API. Install .NET SDK 10 or a compatible version for the <code>net10.0</code> target. Not needed for the GitHub Pages static build.</span>
              </div>
            </div>
          </tp-section-card>

          <tp-section-card title="Run the backend" subtitle="The ASP.NET Core Minimal API provides team, member, evaluation, goal, and feedback data.">
            <div class="code-block-group">
              <pre><code>cd backend/TeamPulse.Api
dotnet run</code></pre>
              <div class="url-list">
                <div class="url-item"><p-tag value="HTTP API" severity="secondary" /><code>http://localhost:5001/api</code></div>
                <div class="url-item"><p-tag value="Health" severity="success" /><code>http://localhost:5001/health</code></div>
                <div class="url-item"><p-tag value="Swagger" severity="info" /><code>http://localhost:5001/swagger</code></div>
              </div>
              <p class="note">The backend uses in-memory seed data. There is no database, no Entity Framework, no JWT, and no real authentication.</p>
            </div>
          </tp-section-card>

          <tp-section-card title="Run the frontend" subtitle="The Angular app calls the backend API at http://localhost:5001/api.">
            <div class="code-block-group">
              <pre><code>cd frontend
npm install
npm start</code></pre>
              <div class="url-list">
                <div class="url-item"><p-tag value="App" severity="secondary" /><code>http://localhost:4200</code></div>
              </div>
              <p class="note">The Angular environment file <code>frontend/src/environments/environment.ts</code> sets <code>apiBaseUrl: 'http://localhost:5001/api'</code> for local development. The frontend makes standard <code>HttpClient</code> calls to the ASP.NET Core Minimal API endpoints.</p>
            </div>
          </tp-section-card>

          <tp-section-card title="Build commands" subtitle="Standard build and preview options.">
            <div class="build-table">
              <div class="build-row header-row">
                <span>Command</span>
                <span>Purpose</span>
              </div>
              <div class="build-row">
                <code>npm run build</code>
                <span>Production build targeting the local API configuration.</span>
              </div>
              <div class="build-row">
                <code>npm run build:github-pages</code>
                <span>Static build with <code>/TeamPulse/</code> base href for GitHub Pages hosting.</span>
              </div>
              <div class="build-row">
                <code>npm run preview:github-pages -- --host 127.0.0.1</code>
                <span>Serve the GitHub Pages build locally at <code>http://127.0.0.1:4300/TeamPulse</code>.</span>
              </div>
            </div>
          </tp-section-card>
        </p-tabpanel>

        <!-- GITHUB PAGES TAB -->
        <p-tabpanel value="github-pages">
          <tp-section-card title="Static hosted setup" subtitle="The GitHub Pages build is a frontend-only static deployment. No backend is required.">
            <div class="code-block-group">
              <p-tag value="Static only — no backend" severity="warn" />
              <p class="note-spaced">
                The GitHub Pages build uses <code>dataMode: 'static'</code>. On first load it reads seed JSON files from <code>assets/seed-data/</code>, writes them into browser localStorage under namespaced keys (e.g. <code>teampulse.v2.members</code>), and then serves all subsequent reads from localStorage. Create, edit, and delete actions are persisted to localStorage only — they reset when the browser clears site data.
              </p>
            </div>
          </tp-section-card>

          <tp-section-card title="Shared seed data" subtitle="Both the local API and the static build use the same sample workspace.">
            <p class="note-spaced">
              Seed data files live in <code>shared/seed-data/</code>. The local ASP.NET Core API loads them at startup. The Angular static build copies them to <code>assets/seed-data/</code> during the build step. Both setups produce the same 5 teams, 60 members, 5 managers, and matching evaluations, goals, and feedback records.
            </p>
            <p class="note-spaced">This is a learning project. The shared data is intentionally fixed — it is not synced across browsers or devices.</p>
          </tp-section-card>

          <tp-section-card title="Build and preview" subtitle="Build the GitHub Pages output and test it locally.">
            <div class="code-block-group">
              <pre><code>cd frontend
npm run build:github-pages</code></pre>
              <p class="note">Output: <code>frontend/dist/teampulse-frontend/browser</code></p>
              <p class="note">The build copies seed JSON assets, writes <code>404.html</code> for Angular route fallback, and adds <code>.nojekyll</code>.</p>
              <pre><code>npm run preview:github-pages -- --host 127.0.0.1</code></pre>
              <p class="note">Open: <code>http://127.0.0.1:4300/TeamPulse</code></p>
            </div>
          </tp-section-card>

          <tp-section-card title="Not a normal product mode" subtitle="GitHub Pages is a demo convenience, not a production deployment model.">
            <p class="note-spaced">
              The static setup is provided so TeamPulse can be shared without running a server. It is not the recommended way to run TeamPulse for real use cases. For production-like evaluation, run the full local stack (backend + frontend) as described in the Local Setup tab.
            </p>
          </tp-section-card>
        </p-tabpanel>

        <!-- TROUBLESHOOTING TAB -->
        <p-tabpanel value="troubleshooting">
          <p-accordion>

            <p-accordion-panel value="node-not-found">
              <p-accordion-header>node or npm not recognized</p-accordion-header>
              <p-accordion-content>
                <p>The Node.js installer did not add the binaries to your PATH, or the terminal session predates the install.</p>
                <ul class="detail-list">
                  <li>Close and reopen your terminal after installing Node.js.</li>
                  <li>Run <code>node -v</code> and <code>npm -v</code> to confirm the versions are visible.</li>
                  <li>On Windows, check that <code>%AppData%\npm</code> and the Node.js install folder appear in your user PATH environment variable.</li>
                  <li>If you manage multiple Node versions, ensure the active version satisfies Angular 21 requirements (Node.js 22 LTS or newer).</li>
                </ul>
              </p-accordion-content>
            </p-accordion-panel>

            <p-accordion-panel value="npm-install">
              <p-accordion-header>npm install fails or takes a long time</p-accordion-header>
              <p-accordion-content>
                <ul class="detail-list">
                  <li>Delete <code>frontend/node_modules</code> and <code>frontend/package-lock.json</code>, then rerun <code>npm install</code>.</li>
                  <li>Run <code>npm cache clean --force</code> if you suspect a corrupt local cache.</li>
                  <li>Check your network proxy settings if you are behind a corporate firewall — npm may need <code>HTTP_PROXY</code> or an <code>.npmrc</code> registry entry.</li>
                  <li>Do not change Angular package versions. All Angular packages are pinned to <code>21.2.9</code>.</li>
                </ul>
              </p-accordion-content>
            </p-accordion-panel>

            <p-accordion-panel value="password-warning">
              <p-accordion-header>Browser shows a weak password warning</p-accordion-header>
              <p-accordion-content>
                <p>Earlier project versions used simple demo passwords. This warning should not appear with the current credentials.</p>
                <ul class="detail-list">
                  <li>Manager password: <code>TeamPulse-Manager-2026!</code></li>
                  <li>Team member password: <code>TeamPulse-Member-2026!</code></li>
                  <li>If the warning still appears, dismiss it — it does not block login. The credentials are intentionally not real user passwords.</li>
                  <li>If you see autofill suggestions for real passwords, use an incognito/private window for the demo.</li>
                </ul>
              </p-accordion-content>
            </p-accordion-panel>

            <p-accordion-panel value="stale-storage">
              <p-accordion-header>Stale localStorage or site data</p-accordion-header>
              <p-accordion-content>
                <p>The static build initializes localStorage from seed JSON on first load and tracks a <code>seedVersion</code> key. If data looks wrong or mutations from a previous session are interfering:</p>
                <ul class="detail-list">
                  <li>Open browser DevTools → Application → Storage → Clear site data for <code>localhost</code> or the GitHub Pages origin.</li>
                  <li>Reload the page — the seed data will be re-initialized from the JSON assets.</li>
                  <li>Alternatively, open the console and run <code>localStorage.clear()</code> then reload.</li>
                </ul>
              </p-accordion-content>
            </p-accordion-panel>

            <p-accordion-panel value="gh-pages-refresh">
              <p-accordion-header>GitHub Pages shows 404 on direct URL or page refresh</p-accordion-header>
              <p-accordion-content>
                <p>GitHub Pages does not natively support Angular's path-based routing. The project uses a <code>404.html</code> fallback to handle this.</p>
                <ul class="detail-list">
                  <li>Make sure <code>404.html</code> exists in the deployed output. It is created automatically by <code>npm run build:github-pages</code>.</li>
                  <li>Make sure <code>.nojekyll</code> exists in the output root so GitHub Pages does not ignore files starting with underscores.</li>
                  <li>If you deployed manually, verify that <code>404.html</code> is identical to <code>index.html</code> in the published folder.</li>
                  <li>Deep links like <code>/TeamPulse/dashboard</code> should work after the fallback is in place.</li>
                </ul>
              </p-accordion-content>
            </p-accordion-panel>

          </p-accordion>
        </p-tabpanel>

      </p-tabpanels>
    </p-tabs>
  `,
  styles: [
    `
      .notice-body {
        display: grid;
        gap: var(--tp-space-4);
        justify-items: start;
      }

      .notice-body p {
        margin: 0;
        max-width: 52rem;
        color: var(--tp-muted);
        line-height: 1.65;
      }

      p-tabs {
        display: block;
        margin: 1rem 0;
      }

      p-tab i {
        margin-right: 0.45rem;
      }

      tp-section-card {
        display: block;
        margin-bottom: 1rem;
      }

      .code-block-group {
        display: grid;
        gap: 0.75rem;
      }

      pre {
        overflow: auto;
        border: 2px solid var(--tp-ink);
        border-radius: var(--tp-radius-sm);
        background: #121212;
        color: #65ffb5;
        font-size: 0.9rem;
        line-height: 1.55;
        margin: 0;
        padding: 1rem;
        white-space: pre-wrap;
      }

      code {
        border: 1px solid color-mix(in srgb, var(--tp-ink) 50%, transparent);
        border-radius: 3px;
        background: color-mix(in srgb, var(--tp-accent) 12%, var(--tp-panel));
        color: var(--tp-text);
        font-size: 0.88em;
        padding: 0.15em 0.35em;
      }

      pre code {
        border: none;
        border-radius: 0;
        background: transparent;
        color: inherit;
        font-size: inherit;
        padding: 0;
      }

      .step-label {
        margin: 0;
        color: var(--tp-muted);
        font-size: 0.88rem;
        font-weight: 700;
      }

      .requirements-grid {
        display: grid;
        gap: 0.75rem;
      }

      .req-item {
        border: 2px solid var(--tp-ink);
        border-radius: var(--tp-radius-sm);
        background: color-mix(in srgb, var(--tp-accent) 6%, var(--tp-panel));
        display: grid;
        gap: 0.35rem;
        padding: 0.85rem 1rem;
      }

      .req-name {
        color: var(--tp-text);
        font-weight: 900;
      }

      .req-note {
        color: var(--tp-muted);
        font-size: 0.93rem;
        line-height: 1.55;
      }

      .req-item pre {
        margin-top: 0.5rem;
      }

      .url-list {
        display: grid;
        gap: 0.5rem;
      }

      .url-item {
        display: flex;
        align-items: center;
        gap: 0.65rem;
      }

      .url-item code {
        font-size: 0.92rem;
      }

      .note {
        margin: 0;
        color: var(--tp-muted);
        font-size: 0.93rem;
        line-height: 1.6;
      }

      .note-spaced {
        margin: 0 0 0.75rem;
        color: var(--tp-muted);
        font-size: 0.95rem;
        line-height: 1.65;
      }

      .note-spaced:last-child {
        margin-bottom: 0;
      }

      .build-table {
        display: grid;
        gap: 0;
        border: 2px solid var(--tp-ink);
        border-radius: var(--tp-radius-sm);
        overflow: hidden;
      }

      .build-row {
        display: grid;
        grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
        gap: 1rem;
        border-bottom: 2px solid color-mix(in srgb, var(--tp-ink) 40%, transparent);
        padding: 0.75rem 1rem;
      }

      .build-row:last-child {
        border-bottom: none;
      }

      .header-row {
        background: color-mix(in srgb, var(--tp-accent) 10%, var(--tp-panel));
        font-size: 0.78rem;
        font-weight: 900;
        text-transform: uppercase;
      }

      .build-row span {
        color: var(--tp-muted);
        font-size: 0.93rem;
        line-height: 1.55;
      }

      p-accordion {
        display: block;
      }

      .detail-list {
        margin: 0.5rem 0 0;
        padding-left: 1.25rem;
        color: var(--tp-muted);
        line-height: 1.75;
      }

      p-accordion-content p {
        margin: 0 0 0.5rem;
        color: var(--tp-muted);
        line-height: 1.65;
      }

      @media (max-width: 720px) {
        .build-row {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class RunLocallyPageComponent {}
