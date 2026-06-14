import { execa } from 'execa';
import chalk from 'chalk';
import ora from 'ora';

export async function cmdCi(options) {
  const { stdout: branch } = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']);

  if (options.watch) {
    const spinner = ora(`Watching CI for ${chalk.bold(branch)}...`).start();
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes

    const poll = async () => {
      try {
        const { stdout } = await execa('gh', ['run', 'list', '--branch', branch, '--limit', '1', '--json', 'status,conclusion,name,url']);
        const runs = JSON.parse(stdout);
        if (!runs.length) {
          spinner.text = 'Waiting for CI to start...';
          if (++attempts < maxAttempts) setTimeout(poll, 5000);
          else spinner.warn('No CI run found after 5 minutes.');
          return;
        }

        const run = runs[0];
        spinner.text = `${run.name}: ${run.status}`;

        if (run.status === 'completed') {
          if (run.conclusion === 'success') {
            spinner.succeed(chalk.green(`Build passed. Run \`wiz pr\` to open a pull request.`));
          } else {
            spinner.fail(chalk.red(`Build ${run.conclusion}. Check details: ${run.url}`));
          }
        } else {
          if (++attempts < maxAttempts) setTimeout(poll, 5000);
          else spinner.warn('Timed out waiting for build.');
        }
      } catch (err) {
        spinner.fail(chalk.red('Could not fetch CI status.'));
        console.error(err.message);
      }
    };

    poll();
  } else {
    try {
      const { stdout } = await execa('gh', ['run', 'list', '--branch', branch, '--limit', '3', '--json', 'status,conclusion,name,createdAt,url']);
      const runs = JSON.parse(stdout);
      if (!runs.length) {
        console.log(chalk.gray('No CI runs found for this branch.'));
        return;
      }
      runs.forEach(r => {
        const icon = r.conclusion === 'success' ? '✅' : r.status === 'in_progress' ? '🔄' : '❌';
        console.log(`${icon}  ${r.name}  ${chalk.gray(r.createdAt)}  ${chalk.cyan(r.url)}`);
      });
    } catch (err) {
      console.error(chalk.red('Could not fetch CI status.'), err.message);
    }
  }
}
