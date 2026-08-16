import { execa } from 'execa';
import chalk from 'chalk';
import ora from 'ora';

export async function cmdRestart() {
  const spinner = ora('Restarting app...').start();
  try {
    // Kill any running dev server on port 3000
    await execa('sh', ['-c', 'lsof -ti:3000 | xargs kill -9 2>/dev/null || true']);
    // Re-start — assumes a package.json dev script exists in the repo root
    spinner.text = 'Starting dev server...';
    execa('npm', ['run', 'start:dev'], { stdio: 'ignore', detached: true }).unref();
    await new Promise(r => setTimeout(r, 2000));
    spinner.succeed(chalk.green('App restarted. Open http://localhost:3000'));
  } catch (err) {
    spinner.fail(chalk.red('Restart failed.'));
    console.error(err.message);
  }
}
