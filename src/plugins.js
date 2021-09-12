'use strict';

import { process, loadResults } from './analyzer';
import { error, writeLn } from './logging';

const validName = (name) => {
    if (name.includes('//')) return false;
    return true;
}

export const processPlugins = (plugins) => {
    const result = loadResults();
    for (const plugin of plugins) {
        const isValidPlugin = validName(plugin.cordovaPlugin.name);
        let options = {
            verbose: false,
            plugin: plugin.cordovaPlugin.name, // eg 'cordova-plugin-3dtouch',
            projectName: 'cordova-android-10',
            projectFolder: '../cs-ionic-native-test/proj-cordova-android-10',
            android: plugin.platforms.includes('Android'),
            ios: plugin.platforms.includes('iOS'),
            isCordova: true,
            isCapacitor: false,
            commands: [`npm install ${plugin.packageName}`]
        };

        // TODO: Pull in the project from github locally

        if (isValidPlugin && !result[plugin.cordovaPlugin.name]) {
            process(options);

            options.projectName = 'capacitor';
            options.projectFolder = '../cs-ionic-native-test/proj-capacitor';
            options.isCapacitor = true;
            options.isCordova = false;
            process(options);
        } else {
            if (isValidPlugin) {
                writeLn('Already processed ' + plugin.cordovaPlugin.name);
            } else {
                error(`Invalid plugin name '${plugin.cordovaPlugin.name}'`);
            }
        }
    }
}
