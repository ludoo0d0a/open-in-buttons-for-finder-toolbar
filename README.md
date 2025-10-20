
# 'open in' buttons for MacOS X Finder toolbar and mb pro touchbar

git : https://github.com/ludoo0d0a/open-in-buttons-for-finder-toolbar

## Finder toolbar
![screenshot](src/images/screenshot.png "finder")

![screenshot](src/images/screenshot_2.png "apps")

## Available apps
- Terminal
- iTerm
- TextMate
- Visual Studio Code
- Sublime text
- Atom
- IntelliJ

### Install
- Download apps
- copy to applications folder
- and drag it to Finder toolbar (hold `⌘cmd`)
- to remove old shortcut, drag them out of the toolbar.

## Macbook pro touchbar
![screenshot](src/images/tb.png "tb")
  
![screenshot](src/images/tb-exp.png "tb2")

## How to
### TouchBar. 
Open Setting -> Keyboard -> Touch Bar and add quick access buton to touch bar.  
![screenshot](src/images/tb-settings.png "tb-settings")
  
Then open `*.workflow` files from `scr/touchbar` and save them.  
Or copy `*.workflow` files to `~/Library/Services`

## to create Finder toolbar
Open workflow in Automator, open apps/Open-in-[YOURAPP].app folder

Update script to find executable and launch it.

then convert/save it as Application

To get a proper icon: 
- open properties panel of the new created app
- drag drop application with the chosen icon on the icon in the top left corner of the properties panel.

References:
 - https://github.com/cnstntn-kndrtv/open-in-buttons-for-finder-toolbar
 - https://medium.com/@n1kk/how-to-add-console-here-button-to-finder-toolbar-or-any-other-action-button-84dae9c34891
 - https://www.engadget.com/2008/01/01/mac-automation-saving-automator-workflows/
 - https://emmanuelbernard.com/blog/2017/02/27/start-intellij-idea-command-line/

## Sublime Text
Read [this topic](https://gist.github.com/artero/1236170 "this topic") before run "open-in-Sublime" app

## Text Mate
Read [this](https://manual.macromates.com/en/using_textmate_from_terminal.html "this") before run the app 


## How it works? How to change something?

take a look in `src` folder




## Overview
This project provides a command-line tool to convert macOS Automator `.workflow` files into standalone `.app` bundles. It simplifies the process of packaging Automator workflows for easier distribution and execution.

## Features
- Convert `.workflow` files to `.app` bundles.
- Command-line interface for easy usage.
- Automates the creation of the necessary directory structure for the app.

## Installation
To install the project, clone the repository and install the dependencies using npm:

```bash
git clone <repository-url>
cd workflow-to-app
npm install
```

## Usage
To convert a `.workflow` file to an `.app`, use the following command:

```bash
bin/workflow-to-app <path-to-workflow-file>
```

Replace `<path-to-workflow-file>` with the path to your `.workflow` file.

## Scripts
- `src/index.js`: Entry point for the application.
- `src/automator.js`: Contains functions for interacting with the Automator framework.
- `bin/workflow-to-app`: Shell script to run the application from the command line.
- `scripts/package-workflow.sh`: Automates the packaging process of the workflow into an app.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.