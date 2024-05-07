# vscode-subtitle-reader

Tools to improve subtitle files Readability.

## Features
* Syntaxes highlight (`.ass`, `.ssa`, `.srt`) 
* Preview panel (like `markdown-all-in-one`)

## Develop
1. start Panel server

```sh
yarn dev-panel
```

2. start Extension server
  
Click the sidebar button `Run and debug`, run option `Run Extension Only`. it will open an debug window with test files.

### Other command
- Run Extension: build panel & extension
- Dev Extension: dev panel & extension
- Run Extension only: build extension
- Dev Extension only: dev extension

## Preview

![](https://github.com/Kuro-P/vscode-subtitle-reader/blob/master/images/extension-screenshot.png "extension screeenshot") 

## TODO
- [x] [preview panel] content layout and style
- [x] [preview panel] panel style setting
- [x] [preview panel] panel auto open setting
- [x] [preview panel] panel auto close setting
- [x] [preview panel] sync content when actived document changed
- [x] [preview panel] sync document and panel scroll position 
- [x] [preview panel] panel code hot reload
- [ ] [preview panel] memory manage
- [ ] [extension assets] extension icons
