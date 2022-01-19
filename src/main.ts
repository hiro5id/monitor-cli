import { MonitorControl } from './platforms/monitor-control';
import { Linux } from './platforms/linux';
import { Windows } from './platforms/windows';
import { Darwin } from './platforms/darwin';
import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'http';

export async function main() {
  const platformSpecificMonitors: MonitorControl[] = [new Linux(), new Windows(), new Darwin()];

  const thisPlatform = platformSpecificMonitors.find(f => f.supported());

  if (thisPlatform == null) {
    throw new Error(`This platform [${platformSpecificMonitors[0].platformName}]  is not supported`);
  }

  const host = 'localhost';
  const port = 8083;

  const requestListener = async function (req: IncomingMessage, res: ServerResponse) {
    res.writeHead(200);

    if (req.url?.toLowerCase().startsWith('/on')) {
      res.end(`turning monitor on`);
      await thisPlatform.wake();
    } else if (req.url?.toLowerCase().startsWith('/off')) {
      res.end(`turning monitor off`);
      await thisPlatform.sleep();
    } else {
      res.end(`thanks for coming by`);
    }
  };

  const server = http.createServer(requestListener);
  server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });

  // noinspection InfiniteLoopJS
  while (true) {
    await new Promise(resolve => {
      setTimeout(() => {
        resolve(null);
      }, 10000);
    });
  }
}
