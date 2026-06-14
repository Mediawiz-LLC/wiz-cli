import { execa } from 'execa';
import chalk from 'chalk';
import ora from 'ora';
import * as readline from 'readline/promises';

export async function cmdSave(options) {
  let message = options.message;

  if (!message) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    message = await rl.question('What did you work on? ');
    rl.close();
  }

  const spinner = ora('Saving your work...').start();

  try {
    const { stdout: branch } = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']);

    if (branch === 'edge' || branch === 'main') {
      spinner.fail(chalk.red(`Cannot save directly to ${branch}. Run \`wiz start\` first.`));
      process.exit(1);
    }

    await execa('git', ['add', '-A']);

    // Check if there's anything to commit
    const { stdout: status } = await execa('git', ['status', '--porcelain']);
    if (!status.trim()) {
      spinner.info('Nothing new to save — your work is already up to date.');
      return;
    }

    await execa('git', ['commit', '-m', message]);
    await execa('git', ['push', 'origin', branch, '--set-upstream']);

    spinner.succeed(chalk.green(`Saved. Branch ${chalk.bold(branch)} is up to date.`));
    console.log(chalk.gray(`  Message: "${message}"`));
    console.log(chalk.gray(`  Run \`wiz ci --watch\` to monitor the build, or \`wiz pr\` when ready for review.`));
  } catch (err) {
    spinner.fail(chalk.red('Save failed.'));
    console.error(err.message);
    process.exit(1);
  }
}
