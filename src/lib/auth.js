import { execa } from 'execa';
import chalk from 'chalk';

export async function getCurrentUser() {
  try {
    const { stdout: login } = await execa('gh', ['api', 'user', '--jq', '.login']);
    const { stdout: name } = await execa('gh', ['api', 'user', '--jq', '.name']);
    return { login: login.trim(), name: name.trim() };
  } catch {
    console.error(chalk.red('Not authenticated with GitHub. Run: wiz setup'));
    process.exit(1);
  }
}
