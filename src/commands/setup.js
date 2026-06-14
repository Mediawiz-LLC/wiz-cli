import { execa } from 'execa';
import chalk from 'chalk';
import fs from 'fs';
import os from 'os';
import path from 'path';

export async function cmdSetup() {
  console.log(chalk.bold('\n👋 Welcome to wiz-cli setup\n'));

  // Check gh is available
  try {
    await execa('gh', ['--version']);
  } catch {
    console.error(chalk.red('GitHub CLI (gh) is not installed. Run: brew install gh'));
    process.exit(1);
  }

  // Authenticate with GitHub
  console.log(chalk.cyan('Step 1: Authenticate with GitHub'));
  await execa('gh', ['auth', 'login'], { stdio: 'inherit' });

  // Get the authenticated user
  const { stdout: login } = await execa('gh', ['api', 'user', '--jq', '.login']);
  const { stdout: name } = await execa('gh', ['api', 'user', '--jq', '.name']);

  // Configure git identity
  console.log(chalk.cyan('\nStep 2: Configure git identity'));
  const { stdout: email } = await execa('gh', ['api', 'user/emails', '--jq', '[.[] | select(.primary)][0].email']);
  await execa('git', ['config', '--global', 'user.name', name]);
  await execa('git', ['config', '--global', 'user.email', email]);

  // Write ~/.wiz/config.yml
  const configDir = path.join(os.homedir(), '.wiz');
  fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(path.join(configDir, 'config.yml'), [
    `github_user: ${login}`,
    `name: ${name}`,
    `email: ${email}`,
    `repo: mediawiz/rest-services-mono`,
  ].join('\n') + '\n');

  console.log(chalk.green(`\n✅ Setup complete. You're logged in as ${name} (@${login})`));
  console.log(chalk.gray('Run `wiz start` to begin working on a product.\n'));
}
