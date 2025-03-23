module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      ['module-resolver', {
        alias: {
          'app': './app',
          'react-native$': 'react-native-web',
          'react-native/Libraries/Components/View/ViewStylePropTypes': 'react-native-web/dist/exports/View/ViewStylePropTypes',
          'react-native/Libraries/Components/TextInput/TextInputState': 'react-native-web/dist/modules/TextInputState',
          'react-native/Libraries/Utilities/Platform': 'react-native-web/dist/exports/Platform',
        },
      }],
    ],
  };
};
