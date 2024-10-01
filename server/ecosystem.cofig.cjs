module.exports = {
  apps: [
    {
      name: "llm-crud-server",
      script: "node_modules/.bin/tsx",
      args: "src/app.ts",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
