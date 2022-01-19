import { execFile } from 'child_process';
import { platform } from 'os';
import { MonitorControl } from './monitor-control';

export class Darwin implements MonitorControl {
  constructor() {
    this.platformName = platform();
    if (this.supported()) {
      console.log(`Detected ${this.platformName}`);
    }
  }

  readonly platformName: string;

  async sleep(): Promise<string> {
    return new Promise((resolve, reject) => {
      execFile('pmset', ['displaysleepnow'], error => {
        if (error) {
          reject(error);
        } else {
          resolve('OK');
        }
      });
    });
  }

  public async wake(): Promise<string> {
    return new Promise((resolve, reject) => {
      execFile('caffeinate', ['-u'], error => {
        if (error) {
          reject(error);
        } else {
          resolve('OK');
        }
      });
      resolve('OK');
    });
  }

  supported(): boolean {
    return this.platformName == 'darwin';
  }
}
