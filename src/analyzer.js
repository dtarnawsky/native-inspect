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
        writeFailure(options, command, error.stderr.toString());
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
    run(`ionic cordova plugin add ${options.plugin}`);
    for (const command of options.commands) {
      run(command);
    }
    run('ionic cordova build android', 'android');
    run('ionic cordova build ios', 'ios');
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

