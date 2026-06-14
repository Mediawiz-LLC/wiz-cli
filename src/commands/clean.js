import { execa } from 'execa';
import chalk from 'chalk';
import ora from 'ora';

export async function cmdClean() {
  const spinner = ora('Cleaning workspace...').start();
  try {
    await execa('git', ['clean', '-fdx', '--exclude=.env', '--exclude=node_modules']);
    spinner.succeed(chalk.green('Workspace cleaned. Temp files and build artifacts removed.'));
    console.log(chalk.gray('  .env and node_modules were preserved.'));
  } catch (err) {
    spinner.fail(chalk.red('Clean failed.'));
    console.error(err.message);
  }
}
