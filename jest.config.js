module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/default',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.js$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(vuetify|axios)/)'
  ],
  moduleFileExtensions: ['js', 'json', 'vue'],
};