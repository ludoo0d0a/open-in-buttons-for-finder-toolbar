# Workflow to App

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