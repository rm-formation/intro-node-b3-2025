import fs from 'fs';
import path from 'path';

const recursif = process.argv.find(item => item === '-r') !== undefined;
const cheminDossierBase = process.argv[process.argv.length - 1];

const liste = traiterDossier(cheminDossierBase);
console.log("liste :");
console.log(liste);

function traiterDossier(cheminDossier) {
    const fichiers = [];
    const contenu = fs.readdirSync(cheminDossier);
    contenu.forEach(nomElement => {
        const subPath = path.join(cheminDossier, nomElement);
        const stats = fs.statSync(subPath);
        if (stats.isDirectory()) {
            if (!recursif) {
                return;
            }
            const fichiersSousDossier = traiterDossier(subPath);
            fichiers.push(...fichiersSousDossier);
        } else {
            fichiers.push(subPath);
        }
    });
    return fichiers;
}