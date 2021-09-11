'use strict';

import { process } from './analyzer';

export const processPlugins = (plugins) => {
    for (const plugin of plugins) {

        let options = {
            verbose: false,
            plugin: plugin.cordovaPlugin.name, // eg 'cordova-plugin-3dtouch',
            projectName: 'cordova-android-10',
            projectFolder: '../cs-ionic-native-test/proj-cordova-android-10',
            commands: [`npm install ${plugin.packageName}`]
        };

        // TODO: Pull in the project from github locally
        let project = '../cs-ionic-native-test/proj-cordova-android-10';
        process(options);
    }
}
