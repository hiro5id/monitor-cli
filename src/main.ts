import { MonitorControl } from './platforms/monitor-control';
import { Linux } from './platforms/linux';
import { Windows } from './platforms/windows';
import { Darwin } from './platforms/darwin';

export async function main() {
  const platformSpecificMonitors: MonitorControl[] = [new Linux(), new Windows(), new Darwin()];

  const thisPlatform = platformSpecificMonitors.find(f => f.supported());

  if (thisPlatform == null) {
    throw new Error(`This platform [${platformSpecificMonitors[0].platformName}]  is not supported`);
  }

  console.log('going to sleep');
  await thisPlatform.sleep();

  console.log('waiting');
  await new Promise(resolve => {
    setTimeout(() => {
      resolve('done');
    }, 3000);
  });

  console.log('waking');
  await thisPlatform.wake();
}
