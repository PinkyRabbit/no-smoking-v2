import { I18n } from 'i18n';
import { join as pathJoin } from 'path';
import { en, ru } from './locales';
import { Content } from "./keys";

const i18n = new I18n({
  locales: ['en', 'ru'],
  directory: pathJoin(__dirname, '/locales'),
  defaultLocale: 'ru',
  extension: '.ts',
  updateFiles: false,
  syncFiles: false,
});
const catalog = i18n.getCatalog();
catalog.ru = ru;
catalog.en = en;

export const contentFor = (contentKey: Content) => {
  return i18n.__(contentKey);
};
