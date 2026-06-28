const [baseUrl, expectedEnvironment = '', expectedRelease = ''] = process.argv.slice(2);

if (!baseUrl) {
  console.error('Usage: node infrastructure/ci-cd/smoke-test.mjs <base-url> [expected-env] [expected-release]');
  process.exit(1);
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed for ${url} with status ${response.status}`);
  }

  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed for ${url} with status ${response.status}`);
  }

  return response.text();
}

async function main() {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  const healthUrl = `${normalizedBaseUrl}/api/health`;
  const dashboardUrl = `${normalizedBaseUrl}/api/dashboard`;
  const rootUrl = `${normalizedBaseUrl}/`;

  console.log(`Checking ${healthUrl}`);
  const health = await fetchJson(healthUrl);

  if (health.status !== 'ok') {
    throw new Error('Health check status is not ok.');
  }

  if (expectedEnvironment && health.environment !== expectedEnvironment) {
    throw new Error(`Expected environment ${expectedEnvironment} but received ${health.environment}.`);
  }

  if (expectedRelease && health.releaseVersion !== expectedRelease) {
    throw new Error(`Expected release ${expectedRelease} but received ${health.releaseVersion}.`);
  }

  console.log(`Checking ${dashboardUrl}`);
  await fetchJson(dashboardUrl);

  console.log(`Checking ${rootUrl}`);
  const rootResponse = await fetchText(rootUrl);
  if (!rootResponse.trim()) {
    throw new Error('Root response is empty.');
  }

  console.log(`Smoke test passed for ${baseUrl}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
