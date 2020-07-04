import Store from "electron-store";
import IConfig from "./IConfig";

const store = new Store({ name: "banshee-electron-config" });

const write = (key: string, value: any) => {
  store.set(key, value);
};

const read = (key: string, defaulyValue: any): any => {
  return store.get(key, defaulyValue);
};

const config: IConfig = {
  write,
  read,
};

export default config;
