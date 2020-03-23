
const { execSync } = require('child_process')
const isProduction = process.argv[2] === 'production'

execSync('yarn install')
execSync(isProduction ? 'yarn build' : 'yarn staging')

const ci = require('miniprogram-ci')
const dayjs = require('dayjs')
const project = new ci.Project({
  appid: 'TODO',
  type: 'miniProgram',
  projectPath: 'dist',
  privateKeyPath: 'TODO',
})

ci.upload({
  project,
  version: dayjs().format('YYMMDDHHmmss'),
  desc: isProduction ? 'production' : 'staging',
  robot: isProduction ? 1 : 2,
  onProgressUpdate: console.log, // eslint-disable-line no-console
})
