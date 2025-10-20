const fs = require('fs-extra');
const path = require('path');
const { Command } = require('commander');
const { buildApp } = require('./automator');

function main() {
  const program = new Command();

  program
    .name('build-app')
    .description('Builds a macOS Automator application to open the current Finder directory.')
    .argument('<appName>', 'Short name for the app and workflow directory (e.g., "idea")')
    .argument('<friendlyAppName>', 'The user-facing application name (e.g., "Android Studio")')
    .option('--icon-from <path>', 'Path to a .app to source the icon from (e.g., "/Applications/iTerm.app")')
    .option('--run-script <path>', 'Path to a custom shell script to execute')
    .action((appName, friendlyAppName, options) => {
      console.log(`--- Building ${appName}.app ---`);

      // Correct the workflow path to match the project structure.
      const workflowPath = path.join('src', 'finder', appName, `Open-in-${appName}.workflow`);
      if (!fs.existsSync(workflowPath)) {
        console.error(`Error: Workflow not found at ${path.resolve(workflowPath)}`);
        process.exit(1);
      }

      // Ensure the apps directory exists
      fs.ensureDirSync('apps');

      buildApp({
        workflowPath,
        appName,
        friendlyName: friendlyAppName,
        customRunScriptPath: options.runScript,
        iconFrom: options.iconFrom,
      });
    });

  program.parse(process.argv);
}

main();