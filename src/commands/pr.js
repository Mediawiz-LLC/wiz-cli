import { execa } from 'execa';
import chalk from 'chalk';
import ora from 'ora';
import * as readline from 'readline/promises';

export async function cmdPr(options) {
  const { stdout: branch } = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']);

  if (branch === 'edge' || branch === 'main') {
    console.error(chalk.red(`You're on ${branch} — run \`wiz start\` to begin work on a branch first.`));
    process.exit(1);
  }

  let title = options.title;
  let body = options.body;

  if (!title) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    title = await rl.question('PR title: ');
    if (!body) body = await rl.question('Short description (optional): ');
    rl.close();
  }

  const spinner = ora('Opening pull request...').start();

  try {
    const args = ['pr', 'create', '--base', 'edge', '--title', title, '--head', branch];
    if (body) args.push('--body', body);
    else args.push('--body', '');

    const { stdout } = await execa('gh', args);
    spinner.succeed(chalk.green('Pull request opened.'));
    console.log(chalk.cyan(`  ${stdout.trim()}`));
  } catch (err) {
    spinner.fail(chalk.red('Failed to open PR.'));
    console.error(err.message);
    process.exit(1);
  }
}
