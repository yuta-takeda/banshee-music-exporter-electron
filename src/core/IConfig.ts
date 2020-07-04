export default interface IConfig {
  write: (key: string, value: any) => void;
  read: (key: string, defaultValue: any) => any;
}

declare global {
  interface Window {
    config: IConfig;
  }
}
