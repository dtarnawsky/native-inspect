'use strict';

import * as fs from 'fs';
import { error, failed, ok, write } from './logging';
import { execSync } from 'child_process';

export const process = async (options) => {
  try {
    const run = (command, test) => {
      write(command);
      let log;
      try {
        log = execSync(command, { cwd: options.projectFolder });
        ok('Success');
        if (options.verbose) {
          write(log);
        }
        if (test) {
          writeResult(options, test, true);
        }
      } catch (error) {
        failed('Failed');
        writeFailure(options, command.stdout.toString() + '\n' + command, error.stderr.toString());
        writeResult(options, test, false);
        throw new Error('Command ' + command + ' Failed');
      }
    }

    if (!fs.existsSync(options.projectFolder)) {
      error(`Path does not exist ${options.projectFolder}`);
      throw new Error('Path does not exist: ' + options.projectFolder);
    }

    run('git clean -fdx');
    run('git restore .');
    run('rm -rf plugins');
    run('rm -rf platforms');
    run('npm install');
    if (options.isCordova) {
      run(`ionic cordova plugin add ${options.plugin}`, 'pluginExists');
    }
    if (options.isCapacitor) {
      run(`npm install ${options.plugin}`, 'pluginExists');
    }
    for (const command of options.commands) {
      run(command);
    }
    if (options.isCordova) {
      if (options.android) {
        run('ionic cordova build android', 'android');
      }
      if (options.ios) {
        run('ionic cordova build ios', 'ios');
      }
    }
    if (options.isCapacitor) {
      run('npm run build', 'builds');
      run('npx cap sync', 'capacitorSync');
    }
  } finally {

  }
};

const writeResult = (options, test, success) => {
  let result = loadResults();
  if (!result[options.plugin]) {
    result[options.plugin] = {};
  }
  let res = result[options.plugin][options.projectName];
  if (!res) res = {};
  res[test] = success;
  result[options.plugin][options.projectName] = res;
  saveResults(result);
}

const resultFileName = './results/results.json';

const writeFailure = (options, command, log) => {
  const data = '> ' + command + '\n' + log;
  const filename = './results/plugin-' + options.plugin + '-errors.txt';
  fs.writeFileSync(filename, data);
}

const loadResults = () => {
  if (fs.existsSync(resultFileName)) {
    const json = fs.readFileSync(resultFileName);
    return JSON.parse(json);
  }
  return {};
}

const saveResults = (data) => {
  fs.writeFileSync(resultFileName, JSON.stringify(data, null, 2));
}

