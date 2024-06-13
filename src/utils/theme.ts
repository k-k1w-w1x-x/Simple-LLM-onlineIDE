export function setTheme(theme: string) {
  // terminal 主题切换的实现思路是通过切换 css 变量
  // 1. 设置html 属性
  document.documentElement.setAttribute("data-theme", theme);
}
