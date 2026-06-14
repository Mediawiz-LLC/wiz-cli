import { execa } from 'execa';
import chalk from 'chalk';

export async function cmdShow(target) {
  if (target === 'login') {
    const url = 'http://localhost:3000/login';
    console.log(chalk.cyan(`Opening ${url}...`));
    const platform = process.platform;
    if (platform === 'darwin') await execa('open', [url]);
    else if (platform === 'linux') await execa('xdg-open', [url]);
    else console.log(chalk.gray(`Open this URL in your browser: ${url}`));
  } else {
    console.log(chalk.red(`Unknown target: ${target}. Try: wiz show login`));
  }
}
