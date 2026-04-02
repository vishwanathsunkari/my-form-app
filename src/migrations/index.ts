import * as migration_20260402_090052 from './20260402_090052';

export const migrations = [
  {
    up: migration_20260402_090052.up,
    down: migration_20260402_090052.down,
    name: '20260402_090052'
  },
];
