module.exports = {
  webpack: {
    configure: (config) => {
      return {
        ...config,
        ignoreWarnings: [/Failed to parse source map/],
      };
    },
  },
  babel: {
    plugins: [
      "transform-require-context",
      "babel-plugin-transform-typescript-metadata",
      "babel-plugin-parameter-decorator",
    ],
  },
};
