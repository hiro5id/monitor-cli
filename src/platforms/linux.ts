import { MonitorControl } from './monitor-control';
import { exec } from 'child_process';
import { platform } from 'os';

export class Linux implements MonitorControl {
  constructor() {
    this.DISPLAY = process.env.DISPLAY || ':0';
    this.platformName = platform();
    if (this.supported()) {
      console.log(`Detected ${this.platformName}`);
    }
  }

  private readonly DISPLAY: string;
  readonly platformName: string;

  public async sleep(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        exec(`export DISPLAY=${this.DISPLAY}; xset dpms force suspend`);
      } catch (err) {
        reject(err);
        return;
      }
      resolve('OK');
    });
  }

  wake(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        exec(`export DISPLAY=${this.DISPLAY}; xset dpms force on`);
      } catch (err) {
        reject(err);
        return;
      }
      resolve('OK');
    });
  }

  supported(): boolean {
    return this.platformName == 'linux';
  }
}
