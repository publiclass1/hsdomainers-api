module.exports = {
  apps: [
    {
      name: 'page-viewer',
      cwd: '/home/ubuntu/hsdomainers-page',
      script: './index.js',

    },
    {
      name: 'hsdomainers-api',
      cwd: '/home/ubuntu/hsdomainers-api',
      script: './build/index.js',
      env: {
        PORT: 3001,
        AWS_ACCESS_KEY_ID: 'AKIAS3BD4RJBQ4T7KV3H',
        AWS_ACCESS_SECRET: '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', // Find it in Amazon S3 Dashboard
        AWS_REGION: 'eu-west-2',
        AWS_BUCKET_NAME: 'intersnipe-test',
      }
    },
    {
      name: 'intersnipe-app',
      cwd: '/home/ubuntu/intersnipe-app',
      script: 'npm',
      args: 'start',
      watch: ['dist'],
      ignore_watch: ['git', "node_modules"],
      env: {
        PORT: 3000,
      },
    }
  ]
};
