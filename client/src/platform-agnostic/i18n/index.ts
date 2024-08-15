import Polyglot from 'node-polyglot';
import app from './app';
import form from './form';

const i18n = new Polyglot();

const en = {
  app: app.en,
  form: form.en,
};

i18n.extend(en);

export default i18n;
