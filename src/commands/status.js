import { execa } from 'execa';
import chalk from 'chalk';
import { loadTeamConfig, getProductForBranch } from '../lib/config.js';

export async function cmdStatus() {
  const { stdout: branch } = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  const config = loadTeamConfig();
  const product = getProductForBranch(config, branch);

  if (!product?.shortlink) {
    console.log(chalk.yellow('No product shortlink configured for this branch.'));
    console.log(chalk.gray('Add a shortlink to .wiz/team.yml for this product.'));
    return;
  }

  // Derive the status URL from the shortlink or Heroku app
  const statusUrl = `https://${product.heroku_app}.herokuapp.com/status`;

  try {
    const res = await fetch(statusUrl);
    const json = await res.json();
    console.log(chalk.bold(`\n📡 Status: ${product.display_name}\n`));
    console.log(JSON.stringify(json, null, 2));

    if (res.ok) {
      console.log(chalk.green('\n✅ App is healthy.'));
    } else {
      console.log(chalk.red(`\n⚠️  Status returned HTTP ${res.status}`));
    }
  } catch (err) {
    console.error(chalk.red('Could not reach status endpoint.'));
    console.error(chalk.gray(`  URL tried: ${statusUrl}`));
    console.log(chalk.yellow('\n💡 Make sure your app has a /status endpoint that returns a JSON health check.'));
    console.log(chalk.gray('   Example: { "status": "ok", "db": "connected", "version": "1.0.0" }'));
  }
}
