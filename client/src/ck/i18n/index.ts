import Polyglot from 'node-polyglot';
import form from './form';

const i18n = new Polyglot();

const en = {
  form: form.en,
};

i18n.extend(en);

export default i18n;
