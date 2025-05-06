// eslint-disable-next-line no-undef
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native' +
      '|@react-native' +
      '|@testing-library' +
      '|expo' +
      '|expo-modules-core' +
      '|expo-notifications' +
      ')',
  ],
};
