import { Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/components/section-card/section-card.component';

interface McpEntry {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  what: string;
  why: string;
  teamPulseUse: string;
  setupIdea: string;
  examplePrompt: string;
  commonMistakes: string[];
  safetyNotes: string[];
  aiTools: { name: string; note: string }[];
}

const MCP_ENTRIES: McpEntry[] = [
  {
    id: 'angular-cli',
    name: 'Angular CLI MCP',
    icon: 'pi pi-bolt',
    tagline: 'Let an AI agent run Angular CLI commands on your behalf',
    what:
      'The Angular CLI MCP exposes Angular CLI commands — generate, build, lint, test — as tools that a connected AI agent can call. The agent reads your request, decides which CLI command fits, executes it, and returns the output to you in the chat.',
    why:
      'Typing `ng generate component features/foo/foo-page --standalone` is fast but error-prone when you have a specific folder structure in mind. With this MCP the AI understands the intent, assembles the exact flags, and lets you review the command before it runs.',
    teamPulseUse:
      'When adding a new TeamPulse feature page you can ask the agent to scaffold the component into the right folder, add the route entry, and generate any needed service or guard — all in one prompt instead of writing each command by hand.',
    setupIdea:
      'Add the Angular CLI MCP server to your Claude Code MCP configuration. Point it at the `frontend/` folder so it resolves the Angular workspace. No credentials are needed — it only wraps the CLI you already have installed.',
    examplePrompt:
      'Generate a standalone Angular component called `learning-mcp-page` inside `frontend/src/app/features/learning/` using the project prefix `tp`.',
    commonMistakes: [
      'Running the MCP outside the Angular workspace root — it must resolve `angular.json`.',
      'Forgetting `--standalone` when the project uses standalone-by-default.',
      'Letting the agent add files to the wrong app in a multi-project workspace.'
    ],
    safetyNotes: [
      'The MCP only generates and builds files in your local workspace — nothing is pushed.',
      'Always review generated component selectors and file paths before accepting.',
      'Do not configure the MCP to run `ng deploy` without reviewing the target.'
    ],
    aiTools: [
      { name: 'Claude Code', note: 'Supports MCP servers natively via the MCP configuration in settings.' },
      { name: 'Codex', note: 'Can run Angular CLI commands directly in the terminal tool without an MCP wrapper.' },
      { name: 'GitHub Copilot', note: 'Copilot Chat can suggest the CLI command; you paste it into the terminal yourself.' }
    ]
  },
  {
    id: 'primeng',
    name: 'PrimeNG MCP',
    icon: 'pi pi-th-large',
    tagline: 'Ask your AI agent for accurate PrimeNG component examples',
    what:
      'The PrimeNG MCP gives an AI agent direct access to the PrimeNG component API — inputs, outputs, slots, and template examples — so it can produce accurate usage code instead of hallucinating older APIs.',
    why:
      'PrimeNG has changed its API significantly across major versions. Without grounded documentation the AI often mixes PrimeNG 16 syntax with PrimeNG 19+. The MCP pins the agent to the exact version you are running.',
    teamPulseUse:
      'TeamPulse uses PrimeNG 21 throughout — tables, dialogs, tags, sliders, accordions, and charts. When adding a new page, ask the agent to produce the correct `p-table` template with `#header` and `#body` ng-templates rather than the deprecated row-slot syntax.',
    setupIdea:
      'Register the PrimeNG MCP in your AI agent configuration. No API key is needed. The server reads the PrimeNG version from your `package.json` automatically.',
    examplePrompt:
      'Show me a PrimeNG 21 p-table with pagination, a global search input, and a custom #empty template, using the standalone imports array.',
    commonMistakes: [
      'Asking for PrimeNG examples without specifying the version — the agent may target an older major release.',
      'Mixing PrimeNG free and PrimeNG Pro component APIs in the same prompt.',
      'Forgetting to add the PrimeNG module to the component `imports` array when using standalone components.'
    ],
    safetyNotes: [
      'The MCP only reads documentation — it never installs packages or modifies files on its own.',
      'Always cross-check generated template syntax against the official PrimeNG changelog if you are upgrading.'
    ],
    aiTools: [
      { name: 'Claude Code', note: 'Connects to the PrimeNG MCP for grounded component generation.' },
      { name: 'Codex', note: 'Uses web search to fetch up-to-date PrimeNG docs; slightly less precise without an MCP.' },
      { name: 'GitHub Copilot', note: 'Copilot is trained on public PrimeNG code but may lag behind recent API changes.' }
    ]
  },
  {
    id: 'github',
    name: 'GitHub MCP Server',
    icon: 'pi pi-github',
    tagline: 'Read issues, PRs, and repo metadata from inside your AI chat',
    what:
      'The GitHub MCP Server lets a connected AI agent call the GitHub REST and GraphQL APIs — list issues, read PR diffs, fetch file contents, search commits — without leaving the chat window.',
    why:
      'Context switching between GitHub.com and your editor slows down code review and triage. With the GitHub MCP the agent can read the linked issue, the open PR diff, and the CI status all at once before writing a fix.',
    teamPulseUse:
      'When working on a TeamPulse improvement tracked in a GitHub issue, ask the agent to read the issue description, summarize the acceptance criteria, and then generate a matching Angular implementation plan — all in one prompt.',
    setupIdea:
      'Register the GitHub MCP in your AI agent configuration. Provide a GitHub personal access token scoped to `repo` read. Never commit the token. Store it in an environment variable referenced by the MCP config.',
    examplePrompt:
      'Read issue #12 in MohammedKhalil86/TeamPulse and list the acceptance criteria as a checklist.',
    commonMistakes: [
      'Granting write scopes when only `repo` read is needed — follow the principle of least privilege.',
      'Committing the personal access token to source control.',
      'Using a token with access to private repos you do not intend to expose to the agent session.'
    ],
    safetyNotes: [
      'Use a fine-grained GitHub token scoped to only the repositories and permissions needed.',
      'Rotate the token regularly and revoke it when not in use.',
      'Review every proposed git push or PR creation before allowing the agent to proceed.'
    ],
    aiTools: [
      { name: 'Claude Code', note: 'Supports the GitHub MCP Server natively; can read issues and PRs inline.' },
      { name: 'Codex', note: 'Can use the GitHub CLI (`gh`) from the terminal tool to achieve similar read access.' },
      { name: 'GitHub Copilot', note: 'Copilot already has deep GitHub integration; MCP adds programmatic control.' }
    ]
  },
  {
    id: 'context7',
    name: 'Context7',
    icon: 'pi pi-book',
    tagline: 'Pull live library documentation into any AI prompt',
    what:
      'Context7 is an MCP server that resolves library names and version numbers to up-to-date documentation snippets. When you mention `Angular 21` or `PrimeNG 19` the server fetches relevant docs and injects them into the AI context before the model responds.',
    why:
      'AI models are trained on data up to a cutoff date. Angular, RxJS, and PrimeNG all update frequently. Context7 closes that gap by supplying current docs without you pasting them manually.',
    teamPulseUse:
      'Ask the agent to write a TeamPulse service using Angular 21 signals and computed — Context7 ensures the agent uses the Angular 21 API rather than an older draft syntax.',
    setupIdea:
      'Add Context7 to your Claude Code MCP configuration. No personal credentials are needed — it fetches public documentation only.',
    examplePrompt:
      'Using the Angular 21 signals API, write a service that wraps a BehaviorSubject as a signal so existing RxJS subscribers still work.',
    commonMistakes: [
      'Asking for a library the server does not index — it covers popular packages but not every niche library.',
      'Relying on Context7 alone when the official changelog or migration guide is what you actually need.'
    ],
    safetyNotes: [
      'Context7 only reads public documentation — it does not access your code or credentials.',
      'Verify injected snippets are from the correct version before using them in production code.'
    ],
    aiTools: [
      { name: 'Claude Code', note: 'Works natively with Context7 MCP; no extra setup beyond the MCP config.' },
      { name: 'Codex', note: 'Can fetch docs via web search; Context7 is more structured and version-aware.' },
      { name: 'GitHub Copilot', note: 'Copilot does not support MCP; you would paste relevant docs manually.' }
    ]
  },
  {
    id: 'playwright',
    name: 'Playwright MCP',
    icon: 'pi pi-desktop',
    tagline: 'Drive a real browser from your AI agent for testing and inspection',
    what:
      'The Playwright MCP lets a connected AI agent open a Chromium, Firefox, or WebKit browser, navigate to pages, click elements, fill forms, take screenshots, and assert on DOM state — all through the browser automation API.',
    why:
      'Instead of writing Playwright tests by hand, you can describe a user journey in plain language and let the agent record the selectors, generate the test file, and report failures with screenshots.',
    teamPulseUse:
      'Ask the agent to open TeamPulse locally, log in as a manager, navigate to the Members page, and verify that the "Add Member" button is visible — the agent produces a reusable Playwright test from the interaction.',
    setupIdea:
      'Add the Playwright MCP to your AI agent configuration. Point it at your locally running TeamPulse dev server (`http://localhost:4200`). No external API key is needed.',
    examplePrompt:
      'Open http://localhost:4200/login, fill the email with manager1@teampulse.demo and the password field, click Login, and verify that the Dashboard heading is visible.',
    commonMistakes: [
      'Leaving the browser pointed at a production URL — always use a local or staging instance for automation.',
      'Using brittle CSS selectors generated by the agent; prefer `data-testid` attributes or ARIA roles.',
      'Running browser automation against a GitHub Pages static build that has no backend — seed data mutations will not persist.'
    ],
    safetyNotes: [
      'Never point the Playwright MCP at a real production app with live user data.',
      'Do not pass real credentials to the agent session — use demo credentials only.',
      'Screenshots taken by the agent may include sensitive screen content; review before sharing.'
    ],
    aiTools: [
      { name: 'Claude Code', note: 'Supports the Playwright MCP; can generate and run tests interactively.' },
      { name: 'Codex', note: 'Can write Playwright test files and run them via the terminal tool.' },
      { name: 'GitHub Copilot', note: 'Copilot can suggest Playwright test code in the editor; browser execution requires the terminal.' }
    ]
  }
];

@Component({
  selector: 'tp-mcp-servers-page',
  standalone: true,
  imports: [AccordionModule, ButtonModule, PanelModule, SectionCardComponent, PageHeaderComponent, TabsModule, TagModule],
  template: `
    <tp-page-header
      eyebrow="Learning Lab / MCP Servers"
      title="MCP Servers"
      subtitle="Model Context Protocol servers are development-time tools that give AI coding agents access to libraries, browsers, APIs, and documentation. TeamPulse users do not need MCPs — they are for developers building or studying the project."
    />

    <tp-section-card title="What is an MCP server?" subtitle="A quick primer before diving into specific servers.">
      <div class="overview-grid">
        <div class="overview-item">
          <span class="label">What</span>
          <p>An MCP server is a local process (or remote service) that exposes a set of named tools — functions with typed inputs and outputs — that a connected AI agent can call during a conversation.</p>
        </div>
        <div class="overview-item">
          <span class="label">When</span>
          <p>MCPs are active only during a developer's AI-assisted coding session. They are not shipped in the app, not loaded at runtime, and not visible to TeamPulse end-users.</p>
        </div>
        <div class="overview-item">
          <span class="label">Who uses them</span>
          <p>Developers using Claude Code, Codex, or other MCP-compatible agents while building, debugging, or learning from a codebase.</p>
        </div>
        <div class="overview-item">
          <span class="label">Safety baseline</span>
          <p>Always grant the minimum required permissions, store tokens in environment variables, never commit secrets, and review every agent action before it writes or deploys anything.</p>
        </div>
      </div>
    </tp-section-card>

    <p-tabs [value]="MCP_ENTRIES[0].id">
      <p-tablist>
        @for (mcp of MCP_ENTRIES; track mcp.id) {
          <p-tab [value]="mcp.id">
            <i [class]="mcp.icon"></i>
            <span>{{ mcp.name }}</span>
          </p-tab>
        }
      </p-tablist>
      <p-tabpanels>
        @for (mcp of MCP_ENTRIES; track mcp.id) {
          <p-tabpanel [value]="mcp.id">
            <div class="mcp-header">
              <p-tag [value]="mcp.tagline" severity="info" />
            </div>

            <div class="mcp-grid">
              <p-panel header="What it is">
                <p>{{ mcp.what }}</p>
              </p-panel>
              <p-panel header="Why it helps">
                <p>{{ mcp.why }}</p>
              </p-panel>
              <p-panel header="How it helps TeamPulse development">
                <p>{{ mcp.teamPulseUse }}</p>
              </p-panel>
              <p-panel header="Example setup idea">
                <p>{{ mcp.setupIdea }}</p>
              </p-panel>
            </div>

            <p-panel header="Example prompt">
              <pre>"{{ mcp.examplePrompt }}"</pre>
            </p-panel>

            <p-accordion>
              <p-accordion-panel value="mistakes">
                <p-accordion-header>Common mistakes</p-accordion-header>
                <p-accordion-content>
                  <ul class="detail-list">
                    @for (mistake of mcp.commonMistakes; track mistake) {
                      <li>{{ mistake }}</li>
                    }
                  </ul>
                </p-accordion-content>
              </p-accordion-panel>
              <p-accordion-panel value="safety">
                <p-accordion-header>Safety notes</p-accordion-header>
                <p-accordion-content>
                  <ul class="detail-list safety">
                    @for (note of mcp.safetyNotes; track note) {
                      <li>{{ note }}</li>
                    }
                  </ul>
                </p-accordion-content>
              </p-accordion-panel>
              <p-accordion-panel value="aitools">
                <p-accordion-header>AI tools and similar workflows</p-accordion-header>
                <p-accordion-content>
                  <div class="ai-tool-list">
                    @for (tool of mcp.aiTools; track tool.name) {
                      <div class="ai-tool-item">
                        <p-tag [value]="tool.name" severity="secondary" />
                        <span>{{ tool.note }}</span>
                      </div>
                    }
                  </div>
                </p-accordion-content>
              </p-accordion-panel>
            </p-accordion>
          </p-tabpanel>
        }
      </p-tabpanels>
    </p-tabs>

    <tp-section-card title="Important reminder" subtitle="MCPs are development-time helpers only.">
      <div class="reminder-body">
        <p-tag value="Dev-time only" severity="warn" />
        <p>
          MCP servers run on a developer's local machine during an AI coding session. They are not part of the TeamPulse runtime. TeamPulse has no AI features embedded in the application. Users of the deployed TeamPulse app do not interact with, depend on, or need to know about MCP servers.
        </p>
      </div>
    </tp-section-card>
  `,
  styles: [
    `
      .overview-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
      }

      .overview-item {
        border: 2px solid var(--tp-ink);
        border-radius: var(--tp-radius-sm);
        background: color-mix(in srgb, var(--tp-accent) 8%, var(--tp-panel));
        padding: 1rem;
      }

      .label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--tp-muted);
        font-size: 0.78rem;
        font-weight: 900;
        text-transform: uppercase;
      }

      .overview-item p {
        margin: 0;
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

      .mcp-header {
        margin-bottom: 1rem;
      }

      .mcp-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
      }

      p {
        margin: 0;
        color: var(--tp-muted);
        line-height: 1.65;
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

      p-accordion {
        display: block;
        margin-top: 1rem;
      }

      .detail-list {
        margin: 0;
        padding-left: 1.25rem;
        color: var(--tp-muted);
        line-height: 1.75;
      }

      .safety li {
        color: var(--tp-text);
        font-weight: 700;
      }

      .ai-tool-list {
        display: grid;
        gap: 0.75rem;
      }

      .ai-tool-item {
        display: flex;
        align-items: start;
        gap: 0.75rem;
      }

      .ai-tool-item span {
        color: var(--tp-muted);
        font-size: 0.95rem;
        line-height: 1.55;
      }

      .reminder-body {
        display: grid;
        gap: var(--tp-space-4);
        justify-items: start;
      }

      .reminder-body p {
        max-width: 52rem;
      }

      @media (max-width: 900px) {
        .overview-grid,
        .mcp-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class McpServersPageComponent {
  protected readonly MCP_ENTRIES = MCP_ENTRIES;
}
