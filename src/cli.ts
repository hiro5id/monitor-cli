#!/usr/bin/env node

import { main } from './main';

main()
  .then(() => {
    console.log(`done..`);
    process.exit(0);
  })
  .catch(err => {
    console.error(`failed: ${err}`);
    process.exit(1);
  });
