### Dev webview panel

start a server and automatically refresh compiled files.

```sh
yarn dev-panel
```

### Dev extension
  
Run option `Run Dev Extension`, open a debugging window with test files.

### Launch options
- Run Build: build panel & extension
- Run Dev: dev panel & extension

As of June 24, 2025, the official VSCode team still hasn't introduced a useful hotload solution.
Using `Cmd + Shift + F5` will reload full extension, including rerun the compile script. Therefore, we can only rely on the extension build approach.

Panel views basic on webpack-dev-server to support hot updates, use `Run Dev` to see modifications take effect in real-time within webview panel.