import { Quasar } from 'quasar'
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from 'src/i18n'
import { localize } from 'vee-validate';
import { StorageService } from '../services/storage';
const currentLocale = StorageService.getLocale() || Quasar.lang.isoName
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: currentLocale,
  fallbackLocale: 'en-us',
  messages
});

try {
  if (currentLocale == 'en-us') {
    currentLocale = 'en'
  }
  import(`vee-validate/dist/locale/${currentLocale}`).then(localeModule => {
    localize(currentLocale, localeModule);
  });
}
catch (ex) {
  console.log(`Veevalidate locale(${currentLocale}) not available`)
}

export default ({ app }) => {
  // Set i18n instance on app
  app.i18n = i18n
}

export { i18n }