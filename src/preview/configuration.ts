import * as vscode from 'vscode'


class Configuration {
  protected _configuration?: vscode.WorkspaceConfiguration

  constructor () {
    this._configuration = this.flush()
  }

  get(name: string) {
    this.flush()
    if (this._configuration) {
      return this._configuration.get(name)
    }
  }

  // get the lastest configuration
  flush(): vscode.WorkspaceConfiguration {
    this._configuration = vscode.workspace.getConfiguration('subtitleReader')

    return this._configuration
  }
}

export default Configuration
