import chalk from 'chalk';
import qrcode from 'qrcode-terminal';
import { execa } from 'execa';
import { loadTeamConfig, getProductForBranch } from '../lib/config.js';

export async function cmdQr() {
  const { stdout: branch } = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  const config = loadTeamConfig();
  const product = getProductForBranch(config, branch);

  const url = product?.shortlink
    ? `https://${product.shortlink}`
    : product?.heroku_app
    ? `https://${product.heroku_app}.herokuapp.com`
    : null;

  if (!url) {
    console.log(chalk.yellow('No URL configured for this product. Add a shortlink to .wiz/team.yml.'));
    return;
  }

  console.log(chalk.bold(`\n📱 Scan to open ${product.display_name}\n`));
  qrcode.generate(url, { small: true });
  console.log(chalk.cyan(`\n  ${url}\n`));
}
