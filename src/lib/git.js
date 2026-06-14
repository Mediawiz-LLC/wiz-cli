import { execa } from 'execa';

export async function findRepoRoot() {
  const { stdout } = await execa('git', ['rev-parse', '--show-toplevel']);
  return stdout.trim();
}
