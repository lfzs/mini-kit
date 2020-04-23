const { execSync } = require('child_process')
const isProduction = process.argv[2] === 'production'

execSync('yarn install')
execSync(isProduction ? 'yarn build' : 'yarn staging')

const ci = require('miniprogram-ci')
const dayjs = require('dayjs')
const { appid } = require('./../project.config.json')

const project = new ci.Project({
  appid,
  type: 'miniProgram',
  projectPath: 'dist',
  privateKeyPath: 'private.key',
})

ci.upload({
  project,
  version: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  desc: isProduction ? 'production' : 'staging',
  robot: isProduction ? 1 : 2,
  onProgressUpdate: console.log, // eslint-disable-line no-console
})
