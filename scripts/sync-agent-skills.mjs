// Copies the Agent Skills from the-square-labs/gateway-skills into the published site:
//   node scripts/sync-agent-skills.mjs [path/to/gateway-skills/skills]
// Each skill folder becomes /agent/<name>/ (SKILL.md plus references), and
// /agent/index.json lists them for llms.txt and for agents that fetch the index.
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const source = resolve(process.argv[2] ?? '../gateway-skills/skills');
const target = resolve('public/agent');
if (!existsSync(source)) {
	console.error(`No skills folder at ${source}`);
	process.exit(1);
}

const frontmatterValue = (text, key) =>
	text.match(/^---\n([\s\S]*?)\n---/)?.[1].match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1].trim();

rmSync(target, { recursive: true, force: true });
const index = [];
for (const name of readdirSync(source).sort()) {
	const folder = join(source, name);
	const skillFile = join(folder, 'SKILL.md');
	if (!statSync(folder).isDirectory() || !existsSync(skillFile)) continue;
	const skill = readFileSync(skillFile, 'utf8');
	if (frontmatterValue(skill, 'name') !== name) {
		console.error(`${skillFile}: frontmatter name must be "${name}"`);
		process.exit(1);
	}
	cpSync(folder, join(target, name), { recursive: true });
	index.push({ name, description: frontmatterValue(skill, 'description'), url: `/agent/${name}/SKILL.md` });
}
writeFileSync(join(target, 'index.json'), `${JSON.stringify(index, null, 2)}\n`);
console.log(`${index.length} skills copied to ${target}`);
