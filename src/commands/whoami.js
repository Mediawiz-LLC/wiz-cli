import { execa } from 'execa';
import chalk from 'chalk';

export async function cmdWhoami() {
  try {
    const { stdout: login } = await execa('gh', ['api', 'user', '--jq', '.login']);
    const { stdout: name } = await execa('gh', ['api', 'user', '--jq', '.name']);
    console.log(chalk.green(`${name} (@${login})`));
  } catch {
    console.error(chalk.red('Not authenticated. Run: wiz setup'));
    process.exit(1);
  }
}
