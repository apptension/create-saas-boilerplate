import telemetryConfig from '@apptension/saas-boilerplate-telemetry';

export const GH_REPO_OWNER = 'apptension';
export const GH_REPO_NAME = 'saas-boilerplate';

export const PROJECT_NAME = 'SaaS Boilerplate';

export const DOCS_URL = 'https://docs.demo.saas.apptoku.com/';
export const LANDING_URL = 'https://www.apptension.com/saas-boilerplate';
export const DISCORD_URL = 'https://discord.apptension.com';
export const GITHUB_REPOSITORY = `https://github.com/${GH_REPO_OWNER}/${GH_REPO_NAME}`;

const IS_CI = Boolean(process.env.CI ?? false);

export const SB_TELEMETRY_DISABLED = IS_CI || (Boolean(process.env.SB_TELEMETRY_DISABLED) ?? false);
export const SB_TELEMETRY_DEBUG = IS_CI || (Boolean(process.env.SB_TELEMETRY_DEBUG) ?? false);
const [telemetryUrl, telemetryKey] = telemetryConfig;
export const SB_TELEMETRY_URL = process.env.SB_TELEMETRY_URL ?? telemetryUrl;
export const SB_TELEMETRY_KEY = process.env.SB_TELEMETRY_KEY ?? telemetryKey;
