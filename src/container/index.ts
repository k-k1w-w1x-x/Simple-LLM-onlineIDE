import { WebContainer } from "@webcontainer/api";
import { Observable } from "../utils/Observer";
// 封装 Web container

class WebContainerAPI extends Observable {
  private container!: WebContainer | null;
  constructor() {
    super();
    this.container = null;
  }

  //   boot
  async boot() {
    if (this.container) {
      this.container.teardown();
      this.container = null;
    }
    console.log("start boot.");
    this.container = await WebContainer.boot();
    console.log("boot success.");
    this.emit("booted");
  }

  getContainer() {
    return this.container;
  }
}

// 导出实例对象
export const webcontainer = new WebContainerAPI();
