"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nonce = Math.round(Math.random() * 2 ** 20);
const template = `
<!DOCTYPE html>
<html lang="zh-cn">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" type="text/css" href="{{ panelStyleLink }}">
  <title>Subtitle preview</title>
</head>
<body>
  <p>{{ panelStyleLink }}</p>
  <div class="content">
    <section>
      <h2>[Script Info]</h2>
      {{#each scriptInfo}}
      <p>{{ this }}</p>
      {{/each}}
    </section>

    <section>
      <h2>[Events]</h2>
      {{#each eventsInfo}}
      <div class="dialogue">
      <p class="time">{{ start }} —> {{ end }}</p>
      <div class="text">
        <p class="primary-text">{{ primaryText }}</p>
        <p class="subsidiary-text">{{ subsidiaryText }}</p>
      </div>
      </div>
      {{/each}}
    </section>
  </div>
</body>
</html>
`;
exports.default = template;
//# sourceMappingURL=panelTempl.js.map