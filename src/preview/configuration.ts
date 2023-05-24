import * as vscode from 'vscode'


class Configuration {
  configuration?: vscode.WorkspaceConfiguration

  constructor () {
    this.configuration = this.update()
  }

  get(name: string) {
    if (this.configuration) {
      return this.configuration.get(name)
    }
  }

  update(): vscode.WorkspaceConfiguration {
    this.configuration = vscode.workspace.getConfiguration('subtitleReader')

    return this.configuration
  }
}

export {
  Configuration
}
