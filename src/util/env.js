
const env = {
  development: {
    // host: 'http://127.0.0.1:3000',
    host: 'https://lepebble.beansmile-dev.com',
  },
  staging: {
    host: 'https://',
  },
  production: {
    host: 'https://',
  },
}

export const { host } = env[process.env.NODE_ENV]
