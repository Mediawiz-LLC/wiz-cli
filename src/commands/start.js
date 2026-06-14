import { execa } from 'execa';
import chalk from 'chalk';
import { loadTeamConfig, getProductsForUser } from '../lib/config.js';
import { getCurrentUser } from '../lib/auth.js';
import * as readline from 'readline/promises';

export async function cmdStart(options) {
  const user = await getCurrentUser();
  const config = loadTeamConfig();
  const products = getProductsForUser(config, user.login);

  let branch;

  if (options.studio) {
    branch = `wiz-studio/${user.login}/${options.studio}`;
  } else if (options.product) {
    branch = `product/${options.product}`;
  } else {
    // Interactive product picker
    console.log(chalk.bold(`\nHi ${user.name}! What would you like to work on?\n`));
    products.forEach((p, i) => console.log(`  ${i + 1}. ${p.display_name}`));
    console.log(`  ${products.length + 1}. Something else (studio — research, ideas, questions)\n`);

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = await rl.question('Enter a number: ');
    rl.close();

    const choice = parseInt(answer.trim(), 10);
    if (choice >= 1 && choice <= products.length) {
      branch = `product/${products[choice - 1].id}`;
    } else {
      const topic = await (async () => {
        const rl2 = readline.createInterface({ input: process.stdin, output: process.stdout });
        const t = await rl2.question('Short topic name (e.g. finance-research): ');
        rl2.close();
        return t.trim().toLowerCase().replace(/\s+/g, '-');
      })();
      branch = `wiz-studio/${user.login}/${topic}`;
    }
  }

  // Ensure we're on edge first, then branch
  console.log(chalk.cyan(`\nFetching latest edge...`));
  await execa('git', ['fetch', 'origin', 'edge']);
  await execa('git', ['checkout', 'edge']);
  await execa('git', ['pull', 'origin', 'edge']);

  // Create or switch to the branch
  try {
    await execa('git', ['checkout', '-b', branch, 'origin/edge']);
    console.log(chalk.green(`✅ Created and switched to branch: ${branch}`));
  } catch {
    await execa('git', ['checkout', branch]);
    console.log(chalk.green(`✅ Switched to existing branch: ${branch}`));
  }
}
