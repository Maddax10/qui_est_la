import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';
import { readdirSync } from 'fs';

// const pages = {
//   'index.html': {
//     title: 'Accueil',
//     description: 'Bienvenue sur notre site.'
//   },
//   'contact.html': {
//     title: 'Contact',
//     description: 'Envoyez-nous un message.'
//   },
//   'about.html': {
//     title: 'À propos',
//     description: 'En savoir plus sur nous.'
//   }
// }

//boucle tous les fichier html du projet pour les mettre dans /dist
const htmlFiles = readdirSync(__dirname)
  .filter(file => file.endsWith('.html'))
  .reduce((entries, file) => {
    const name = file.replace(/\.html$/, '');
    entries[name] = resolve(__dirname, file);
    return entries;
  }, {});

export default {
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, './src/partials')
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      input: htmlFiles //récupère tous les fichiers html
    }
  }
}