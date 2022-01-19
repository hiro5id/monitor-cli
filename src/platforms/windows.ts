import { MonitorControl } from './monitor-control';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { platform } from 'os';

export class Windows implements MonitorControl {
  constructor() {
    this.platformName = platform();
    if (this.supported()) {
      console.log(`Detected ${this.platformName}`);
    }
  }

  readonly platformName: string;

  private static exec(cmd: string): ChildProcessWithoutNullStreams {
    return spawn(cmd, [], {
      shell: true,
      windowsHide: true,
    });
  }

  public async sleep(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        Windows.exec(
          'powershell -NonInteractive (Add-Type \'[DllImport(\\"user32.dll\\")]^public static extern int SendMessage(int hWnd, int hMsg, int wParam, int lParam);\' -Name a -Pas)::SendMessage(0xffff,0x0112,0xF170,0x0002)',
        );
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
        Windows.exec(
          'powershell -NonInteractive (Add-Type \'[DllImport(\\"user32.dll\\")]^public static extern void mouse_event(uint dwFlags, int dx, int dy, uint dwData, int dwExtraInfo);\' -Name user32 -PassThru)::mouse_event(1,1,0,0,0)',
        );
        Windows.exec(
          'powershell -NonInteractive (Add-Type \'[DllImport(\\"user32.dll\\")]^public static extern int SendMessage(int hWnd, int hMsg, int wParam, int lParam);\' -Name a -Pas)::SendMessage(0xffff,0x0112,0xF170,-0x0001)',
        );
      } catch (err) {
        reject(err);
        return;
      }
      resolve('OK');
    });
  }

  supported(): boolean {
    return this.platformName == 'win32';
  }
}
