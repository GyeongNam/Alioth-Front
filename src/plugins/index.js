/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'
import piniaPersist from 'pinia-plugin-persist'
import { createPinia } from 'pinia'

const prinaApp = createPinia();
prinaApp.use(piniaPersist);

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(prinaApp)
}
