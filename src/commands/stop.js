import { execa } from 'execa';
import chalk from 'chalk';

export async function cmdStop() {
  const { stdout: status } = await execa('git', ['status', '--porcelain']);
  if (status.trim()) {
    console.log(chalk.yellow('You have unsaved changes. Run `wiz save` before stopping, or they will remain uncommitted.'));
  } else {
    console.log(chalk.green('✅ Nothing unsaved. Session stopped cleanly.'));
  }
}
