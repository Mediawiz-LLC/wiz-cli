import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { findRepoRoot } from './git.js';

export function loadTeamConfig() {
  const root = findRepoRootSync();
  const configPath = path.join(root, '.wiz', 'team.yml');
  if (!fs.existsSync(configPath)) {
    throw new Error('.wiz/team.yml not found. Are you inside rest-services-mono?');
  }
  return yaml.load(fs.readFileSync(configPath, 'utf8'));
}

export function getProductsForUser(config, githubLogin) {
  const member = config.team.find(m => m.github === githubLogin);
  if (!member) return config.products; // owner sees all
  return config.products.filter(p => member.products.includes(p.id));
}

export function getProductForBranch(config, branch) {
  // e.g. product/grad-burger → grad-burger
  const match = branch.match(/^product\/(.+)$/);
  if (!match) return null;
  return config.products.find(p => p.id === match[1]) || null;
}

function findRepoRootSync() {
  let dir = process.cwd();
  while (dir !== path.parse(dir).root) {
    if (fs.existsSync(path.join(dir, '.wiz', 'team.yml'))) return dir;
    dir = path.dirname(dir);
  }
  throw new Error('Could not find repo root (no .wiz/team.yml found).');
}
