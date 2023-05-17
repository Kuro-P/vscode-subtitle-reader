/**
 * 编译完成后 一些想要执行的方法可以写在这里
 */
class compileCallbackPlugin {
  apply(compiler) {
    compiler.hooks.done.tap(
      'Compile calllback plugin',
      (stats) => {
        if (!stats.hasErrors()) {
          console.log('——————————————————📚 Successful Compile 💄——————————————————');
        }
      }
    );
  }
}

module.exports = {
  compileCallbackPlugin
};
