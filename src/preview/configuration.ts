import * as vscode from 'vscode'


class Configuration {
  configuration?: vscode.WorkspaceConfiguration

  constructor () {
    this.configuration = this.flush()
  }

  get(name: string) {
    this.flush()
    if (this.configuration) {
      return this.configuration.get(name)
    }
  }

  // get the lastest configuration
  flush(): vscode.WorkspaceConfiguration {
    this.configuration = vscode.workspace.getConfiguration('subtitleReader')

    return this.configuration
  }
}

export {
  Configuration
}
