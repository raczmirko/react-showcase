import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/locale-en.json'
import hu from './locales/locale-hu.json'
import fr from './locales/locale-fr.json'

const STORAGE_KEY = 'lang'

i18n.use(initReactI18next).init({
  resources: {
    en: { common: en },
    hu: { common: hu },
    fr: { common: fr },
  },
  lng: localStorage.getItem(STORAGE_KEY) ?? 'en',
  fallbackLng: 'en',
  ns: ['common'],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
})

export { STORAGE_KEY as I18N_STORAGE_KEY }
export default i18n