module.exports = {
  apps: [{
    name: 'a11y-app',
    script: 'npx',
    args: ['serve', '-s', 'build', '-l', '5080', '--single'],
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PUBLIC_URL: '/a11y-flashcard'
    }
  }]
};