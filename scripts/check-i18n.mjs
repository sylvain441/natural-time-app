import { readdir, readFile } from 'node:fs/promises';

const LANGUAGE_DIRECTORY = new URL('../src/i18n/lang/', import.meta.url);
const FAQ_DIRECTORY = new URL('../src/i18n/faq/', import.meta.url);

const flatten = (value, prefix = '', output = new Map()) => {
  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof child === 'string') output.set(path, child);
    else if (child && typeof child === 'object') flatten(child, path, output);
  }
  return output;
};

const getPlaceholders = message => [...message.matchAll(/\{([^{}',]+)(?:,[^{}]*)?\}/g)]
  .map(([, name]) => name.trim())
  .sort();

const languageFiles = (await readdir(LANGUAGE_DIRECTORY))
  .filter(file => file.endsWith('.json'))
  .sort();
const locales = new Map(await Promise.all(languageFiles.map(async file => {
  const locale = file.slice(0, -5);
  const messages = JSON.parse(await readFile(new URL(file, LANGUAGE_DIRECTORY), 'utf8'));
  return [locale, flatten(messages)];
})));

const reference = locales.get('fr');
const errors = [];

for (const [locale, messages] of locales) {
  for (const [key, referenceMessage] of reference) {
    if (!messages.has(key)) {
      errors.push(`${locale}: clé manquante ${key}`);
      continue;
    }
    const expected = getPlaceholders(referenceMessage).join(',');
    const actual = getPlaceholders(messages.get(key)).join(',');
    if (actual !== expected) {
      errors.push(`${locale}: variables différentes pour ${key}: attendu={${expected}} reçu={${actual}}`);
    }
  }
}

const faqFiles = (await readdir(FAQ_DIRECTORY))
  .filter(file => file.endsWith('.md'))
  .sort();
const getHeadingCount = (markdown, level) => (
  markdown.match(new RegExp(`^#{${level}} `, 'gm')) || []
).length;
const referenceFaq = await readFile(new URL('fr.md', FAQ_DIRECTORY), 'utf8');
const expectedCategories = getHeadingCount(referenceFaq, 3);
const expectedQuestions = getHeadingCount(referenceFaq, 4);

for (const file of faqFiles) {
  const markdown = await readFile(new URL(file, FAQ_DIRECTORY), 'utf8');
  const categories = getHeadingCount(markdown, 3);
  const questions = getHeadingCount(markdown, 4);
  if (categories !== expectedCategories || questions !== expectedQuestions) {
    errors.push(
      `${file}: structure FAQ ${categories} catégories/${questions} questions, `
      + `attendu ${expectedCategories}/${expectedQuestions}`,
    );
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(
    `${locales.size} langues × ${reference.size} clés et ${faqFiles.length} FAQ cohérentes.`,
  );
}
