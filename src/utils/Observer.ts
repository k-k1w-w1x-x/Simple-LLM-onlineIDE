/**
 * Observable class prototype.
 *
 * @module observable
 */

import { voidFun } from "../type";
type voidMap = Map<string, any>;

export class Observable {
  private _observers: voidMap;

  constructor() {
    this._observers = new Map();
  }

  on(name: string, f: voidFun) {
    let set = this._observers.get(name);
    if (set === undefined) {
      this._observers.set(name, (set = new Set()));
    }
    set.add(f);
  }

  once(name: string, f: voidFun) {
    const _f = (...args: any[]) => {
      this.off(name, _f);
      // eslint-disable-next-line
      //@ts-ignore
      f(...args);
    };
    this.on(name, _f);
  }

  off(name: string, f: voidFun) {
    const observers = this._observers.get(name);
    if (observers !== undefined) {
      observers.delete(f);
      if (observers.size === 0) {
        this._observers.delete(name);
      }
    }
  }

  emit(name: string, args?: any) {
    return Array.from(
      (this._observers.get(name) || new Map()).values()
      //@ts-ignore
    ).forEach((f) => (args ? f(...args) : f()));
  }

  destroy() {
    this._observers = new Map();
  }
}
