'use strict';

const path = require('node:path');

const REPO_ROOT = path.resolve(__dirname, '..');
const DEFAULT_PORT = 4173;

/**
 * Build a Playwright config for one venv.
 *
 * @param {object} opts
 * @param {string} opts.envDir     - absolute path of the venv dir (__dirname of the env config)
 * @param {string} opts.testDir    - repo-relative path to the specs, e.g. 'tests/integration'
 * @param {string} opts.projectName- Playwright project name
 */
module.exports = function baseConfig({ envDir, testDir, projectName }) {
  // Browsers live in the shared sandbox inside testenv/, not ~/.cache/ms-playwright.
  process.env.PLAYWRIGHT_BROWSERS_PATH =
    process.env.PLAYWRIGHT_BROWSERS_PATH || path.join(envDir, '..', 'browsers');

  const baseURL = process.env.BASE_URL || `http://127.0.0.1:${DEFAULT_PORT}`;

  return {
    timeout: 60_000,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? 'github' : 'list',
    use: {
      baseURL,
      trace: 'on-first-retry',
    },
    projects: [
      {
        name: projectName,
        testDir: path.join(REPO_ROOT, testDir),
      },
    ],
    // Serve the repo root with Python's static server unless testing a deployed URL.
    webServer: process.env.BASE_URL
      ? undefined
      : {
          command: `python3 -m http.server ${DEFAULT_PORT} --directory ${REPO_ROOT}`,
          port: DEFAULT_PORT,
          reuseExistingServer: true,
        },
  };
};