const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const plist = require('plist');

/**
 * Finds the full path to a macOS application.
 * It searches in /Applications, ~/Applications, and then uses Spotlight as a fallback.
 * @param {string} appName - The name of the app, e.g., "iTerm.app".
 * @returns {string|null} The full path to the app or null if not found.
 */
function findApplicationPath(appName) {
  const searchPaths = [
    path.join('/Applications', appName),
    path.join(os.homedir(), 'Applications', appName),
  ];

  for (const p of searchPaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  // Fallback to Spotlight search if not in common directories
  try {
    const command = `mdfind "kMDItemKind == 'Application' && kMDItemFSName == '${appName}'"`;
    const result = execSync(command, { encoding: 'utf8' }).trim();
    if (result) {
      return result.split('\n')[0]; // Return the first result
    }
  } catch (error) {
    // mdfind can fail, so we ignore the error and proceed
  }

  return null;
}

/**
 * Replaces the destination app's icon with the icon from a source application.
 * @param {string} srcAppName - The name of the source app (e.g., "iTerm.app").
 * @param {string} destAppPath - Path to the destination .app being built.
 */
function replaceIcon(srcAppName, destAppPath) {
  console.log(`Attempting to replace icon from: ${srcAppName}`);

  const srcAppPath = findApplicationPath(srcAppName);

  if (!srcAppPath) {
    console.warn(`Warning: Source application '${srcAppName}' not found. Skipping icon replacement.`);
    return;
  }

  try {
    const srcInfoPath = path.join(srcAppPath, 'Contents', 'Info.plist');
    const destInfoPath = path.join(destAppPath, 'Contents', 'Info.plist');
    const destResPath = path.join(destAppPath, 'Contents', 'Resources');

    // 1. Find the icon file name from the source app's Info.plist
    const srcPlist = plist.parse(fs.readFileSync(srcInfoPath, 'utf8'));
    let iconFileName = srcPlist.CFBundleIconFile;

    if (!iconFileName) {
      console.warn(`Warning: Could not determine icon file name from '${srcInfoPath}'. Skipping icon replacement.`);
      return;
    }

    // 2. Ensure it has the .icns extension
    if (!iconFileName.endsWith('.icns')) {
      iconFileName += '.icns';
    }

    const srcIconPath = path.join(srcAppPath, 'Contents', 'Resources', iconFileName);
    if (!fs.existsSync(srcIconPath)) {
      console.warn(`Warning: Icon file '${srcIconPath}' not found. Skipping icon replacement.`);
      return;
    }

    // 3. Copy the icon file to the destination, replacing the default 'applet.icns'
    const defaultDestIconPath = path.join(destResPath, 'applet.icns');
    const newDestIconPath = path.join(destResPath, iconFileName);
    fs.copyFileSync(srcIconPath, defaultDestIconPath);
    fs.renameSync(defaultDestIconPath, newDestIconPath);

    // 4. Update the destination Info.plist to reference the new icon file
    const destPlist = plist.parse(fs.readFileSync(destInfoPath, 'utf8'));
    destPlist.CFBundleIconFile = path.basename(iconFileName, '.icns');
    fs.writeFileSync(destInfoPath, plist.build(destPlist));

    // 5. Force the system to recognize the new icon
    fs.utimesSync(destAppPath, new Date(), new Date());

    console.log(`Successfully replaced icon with '${iconFileName}'.`);
  } catch (error) {
    console.error('Error during icon replacement:', error);
  }
}

/**
 * Builds an Automator .app bundle.
 * @param {object} options
 * @param {string} options.workflowPath - The path to the source .workflow directory.
 * @param {string} options.appName - The short name for the app (e.g., 'idea').
 * @param {string} options.friendlyName - The display name for the app (e.g., 'Android Studio').
 * @param {string} [options.customRunScriptPath] - Optional path to a custom run script.
 * @param {string} [options.iconFrom] - Optional path to a .app to source the icon from.
 */
function buildApp({ workflowPath, appName, friendlyName, customRunScriptPath, iconFrom }) {
  const outputAppPath = path.join('apps', `${appName}.app`);

  // 1. Copy the source .workflow to the destination as a .app bundle.
  // This is more reliable than using the automator command.
  console.log(`Copying ${workflowPath} to ${outputAppPath}`);
  fs.copySync(workflowPath, outputAppPath);

  // 2. Prepare the shell script content.
  let shellScriptContent = `finderPath=\`osascript -e 'tell application "Finder" to get the POSIX path of (target of front window as alias)'\`\n`;
  if (customRunScriptPath && fs.existsSync(customRunScriptPath)) {
    console.log(`Using custom run script from ${customRunScriptPath}`);
    const scriptLines = fs.readFileSync(customRunScriptPath, 'utf8').split('\n').slice(1);
    shellScriptContent += scriptLines.join('\n');
  } else {
    console.log(`Using default open command for ${friendlyName}`);
    shellScriptContent += `open -a "${friendlyName}" "$finderPath"`;
  }

  // 3. Update the script content within the new .app bundle.
  const workflowFile = path.join(outputAppPath, 'Contents', 'document.wflow');
  if (!fs.existsSync(workflowFile)) {
    console.error(`Error: Could not find 'document.wflow' in new app bundle at ${workflowFile}`);
    return;
  }

  try {
    const wflowContent = plist.parse(fs.readFileSync(workflowFile, 'utf8'));
    // Find the 'Run Shell Script' action and update its command.
    const shellScriptAction = wflowContent.actions.find(
      (action) => action.ActionIdentifier === 'com.apple.RunShellScript'
    );

    if (shellScriptAction) {
      shellScriptAction.ActionParameters.COMMAND_STRING = shellScriptContent;
      fs.writeFileSync(workflowFile, plist.build(wflowContent));
      console.log('Successfully updated the shell script inside the app bundle.');
    }
  } catch (error) {
    console.error('Error updating document.wflow:', error);
  }

  // 3. Replace the icon if specified.
  if (iconFrom) {
    replaceIcon(iconFrom, outputAppPath);
  }

  console.log(`--- Successfully created ${outputAppPath} ---`);
}

module.exports = {
  buildApp,
};