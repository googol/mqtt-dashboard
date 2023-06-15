const typecheck = (_changedTsFiles) => 'npm run check:types'
const prettier = 'prettier --write --ignore-path .gitignore'
const eslint =
  'eslint --ignore-path .gitignore --cache --cache-strategy content --max-warnings=0 --fix'

const renovateConfigFile = 'renovate.json5'
const renovate = (_changedFiles) =>
  `docker run --rm -v ".:/usr/src/app" renovate/renovate:slim renovate-config-validator ${renovateConfigFile}`

module.exports = {
  '*.{ts,tsx,mts,cts}': [typecheck, eslint, prettier],
  '*.{js,jsx,mjs,cjs}': [eslint, prettier],
  '*.{json,json5,yaml,yml,md}': [prettier],
  [renovateConfigFile]: [renovate],
}
