export interface MonitorControl {
  sleep(): Promise<string>;

  wake(): Promise<string>;

  supported(): boolean;
  platformName: string;
}
