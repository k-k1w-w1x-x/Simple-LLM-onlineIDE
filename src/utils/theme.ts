// config/thene/light.css
// config/thene/dark.css
import "../config/theme/dark.css";
import "../config/theme/light.css";
export function setTheme(theme: string) {
  // terminal 主题切换的实现思路是通过切换 css 变量
  // 1. 设置html 属性
  document.documentElement.setAttribute("data-theme", theme);
  // monaco 主题切换是通过 monaco.editor.setTheme
  // 其他区域的主题切换是通过切换自定义 css 变量
}
