import { MonitorControl } from './platforms/monitor-control';
import { Linux } from './platforms/linux';
import { Windows } from './platforms/windows';
import { Darwin } from './platforms/darwin';

async function main() {
  const platformSpecificMonitors: MonitorControl[] = [new Linux(), new Windows(), new Darwin()];

  const thisPlatform = platformSpecificMonitors.find(f => f.supported());

  if (thisPlatform == null) {
    throw new Error(`This platform [${platformSpecificMonitors[0].platformName}]  is not supported`);
  }

  await thisPlatform.sleep();

  await new Promise(resolve => {
    setTimeout(() => {
      resolve('done');
    }, 3000);
  });

  await thisPlatform.wake();
}

main()
  .then(() => {
    console.log(`done..`);
    process.exit(0);
  })
  .catch(err => {
    console.error(`failed: ${err}`);
    process.exit(1);
  });
