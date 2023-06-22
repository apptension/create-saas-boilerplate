export const GH_REPO_OWNER = 'apptension';
export const GH_REPO_NAME = 'saas-boilerplate';

const DEFAULT_REPOSITORY_URL = `git@github.com:${GH_REPO_OWNER}/${GH_REPO_NAME}.git`;

export const REPOSITORY_URL = process.env.REPOSITORY_URL || DEFAULT_REPOSITORY_URL;

export const PROJECT_NAME = 'SaaS Boilerplate';

export const DOCS_URL = 'https://docs.demo.saas.apptoku.com/';
export const LANDING_URL = 'https://www.apptension.com/saas-boilerplate';
