module.exports = function (api) {
  api.cache(true);
  return {
    plugins: ['preval'],
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
