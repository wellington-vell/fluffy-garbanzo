// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_complex_grey_gargoyle.sql';
import m0001 from './0001_abandoned_clea.sql';
import m0002 from './0002_imagem_uri_produto.sql';

export default {
  journal,
  migrations: {
    m0000,
    m0001,
    m0002,
  },
};
  