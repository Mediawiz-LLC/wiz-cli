#!/usr/bin/env node
import { Command } from 'commander';
import { cmdSetup } from '../src/commands/setup.js';
import { cmdStart } from '../src/commands/start.js';
import { cmdStop } from '../src/commands/stop.js';
import { cmdRestart } from '../src/commands/restart.js';
import { cmdSave } from '../src/commands/save.js';
import { cmdShow } from '../src/commands/show.js';
import { cmdStatus } from '../src/commands/status.js';
import { cmdQr } from '../src/commands/qr.js';
import { cmdClean } from '../src/commands/clean.js';
import { cmdPr } from '../src/commands/pr.js';
import { cmdCi } from '../src/commands/ci.js';
import { cmdSyncOwners } from '../src/commands/sync-owners.js';
import { cmdWhoami } from '../src/commands/whoami.js';

const program = new Command();

program
  .name('wiz')
  .description('MediaWiz developer CLI')
  .version('0.1.0');

program
  .command('setup')
  .description('First-time setup: authenticate with GitHub and configure wiz')
  .action(cmdSetup);

program
  .command('whoami')
  .description('Show the current authenticated GitHub user')
  .action(cmdWhoami);

program
  .command('start')
  .description('Begin a new piece of work from edge')
  .option('-p, --product <id>', 'Product ID to work on')
  .option('-s, --studio <topic>', 'Open a studio branch for non-product work')
  .action(cmdStart);

program
  .command('stop')
  .description('Pause and save current session')
  .action(cmdStop);

program
  .command('restart')
  .description('Restart the local app')
  .action(cmdRestart);

program
  .command('save')
  .description('Commit and push latest changes')
  .option('-m, --message <msg>', 'Commit message')
  .action(cmdSave);

program
  .command('show')
  .argument('<target>', 'What to show (e.g. login)')
  .description('Open the app in the browser')
  .action(cmdShow);

program
  .command('status')
  .description('Check the app health endpoint')
  .action(cmdStatus);

program
  .command('qr')
  .description('Generate a QR code link to the app')
  .action(cmdQr);

program
  .command('clean')
  .description('Clear caches and temporary files')
  .action(cmdClean);

program
  .command('pr')
  .description('Open a pull request for the current branch')
  .option('-t, --title <title>', 'PR title')
  .option('-b, --body <body>', 'PR description')
  .action(cmdPr);

program
  .command('ci')
  .description('Show CI status for the current branch')
  .option('-w, --watch', 'Watch and stream build output')
  .action(cmdCi);

program
  .command('sync-owners')
  .description('Regenerate .github/CODEOWNERS from .wiz/team.yml')
  .action(cmdSyncOwners);

program.parse();
