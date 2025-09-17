#!/usr/bin/env node

const { execSync } = require('child_process');

function main() {
  try {
    const output = execSync('./bin/find-related-files.js', { encoding: 'utf-8' }).trim();

    if (!output) {
      console.log('Aucun fichier lié trouvé.');
      return;
    }

    const lines = output.split('\n');
    const lastLine = lines[lines.length - 1];
    if (!lastLine.startsWith('Fichiers liés:')) {
      console.log('Format de sortie inattendu.');
      return;
    }

    const relatedFilesStr = lastLine.replace('Fichiers liés:', '').trim();
    if (!relatedFilesStr) {
      console.log('Aucun fichier lié trouvé.');
      return;
    }

    const relatedFiles = relatedFilesStr.split(' ');
    const testFiles = relatedFiles.filter(file => file.includes('.test.'));

    if (testFiles.length === 0) {
      console.log('Aucun fichier de test trouvé parmi les fichiers liés.');
      return;
    }

    console.log('Exécution des tests pour:', testFiles.join(' '));

    execSync(`npx vitest --run ${testFiles.join(' ')}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('Erreur lors de l\'exécution des tests:', error.message);
    process.exit(1);
  }
}

main();