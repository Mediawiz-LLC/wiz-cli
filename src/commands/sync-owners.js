import { execaNode } from 'execa';
import chalk from 'chalk';
import path from 'path';
import { findRepoRoot } from '../lib/git.js';

export async function cmdSyncOwners() {
  const root = await findRepoRoot();
  const script = path.join(root, '.wiz', 'scripts', 'generate-codeowners.js');
  try {
    await execaNode(script, { stdio: 'inherit' });
    console.log(chalk.green('✅ CODEOWNERS updated.'));
  } catch (err) {
    console.error(chalk.red('sync-owners failed.'), err.message);
  }
}
