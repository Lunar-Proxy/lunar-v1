/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
    {
      files: "*.ts",
      options: {
        parser: "typescript",
      },
    },
    {
      files: "*.tsx",
      options: {
        parser: "typescript",
      },
    },
    {
      files: "*.md",
      options: {
        parser: "markdown",
      },
    },
    {
      files: "*.json",
      options: {
        parser: "json",
      },
    },
    {
      files: "*.yaml",
      options: {
        parser: "yaml",
      },
    },
    {
      files: "*.css",
      options: {
        parser: "css",
      },
    },

    {
      files: "README.md",
      options: {
        parser: "markdown",
      },
    },
  ],
};
