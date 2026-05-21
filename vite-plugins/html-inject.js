import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const partials = {
  header: 'src/widgets/header/header.html',
  footer: 'src/widgets/footer/footer.html',
};

export function htmlInjectPlugin() {
  return {
    name: 'html-inject',
    transformIndexHtml(html) {
      return html.replace(
        /<!-- inject:(\w+) -->/g,
        (match, key) => {
          const file = partials[key];
          if (!file) {
            this.warn?.(`[html-inject] partial with "${key}" doesn't exist`);
            return match;
          }
          return readFileSync(resolve(__dirname, '..', file), 'utf-8');
        }
      );
    }
  };
}
