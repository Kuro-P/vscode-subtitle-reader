# vscode-subtitle-reader

A tool to enhance the readability of subtitle files.

## Features
* Subtitle files syntaxes highlight (`.ass`, `.ssa`, `.srt`).
* Subtitle files icons support.
* A preview panel with better readability.

## Develop
1. dev panel

```sh
yarn dev-panel # start a server and automatically refresh compiled files.
```

1. dev extension
  
Run option `Run Dev Extension`, open a debugging window with test files.

### Other Launch options
- Run Build: build panel & extension
- Run Dev: dev panel & extension

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
- [ ] [extension assets] extension icons
