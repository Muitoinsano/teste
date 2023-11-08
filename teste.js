const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

// Carregue o arquivo JSON
const jsonFile = fs.readFileSync(path.join(__dirname, 'file.json'));
const jsonData = JSON.parse(jsonFile).Parametros; // Acessando a propriedade 'Parametros'

// Carregue o arquivo YAML
const yamlFile = fs.readFileSync(path.join(__dirname, 'file.yml'), 'utf8');
let yamlData = yaml.load(yamlFile);

// Percorra cada linha do arquivo YAML
for (let key in yamlData) {
    if (typeof yamlData[key] === 'string' && yamlData[key].includes('${')) {
        // Encontre a variável de ambiente
        const envVar = yamlData[key].match(/\${(.*)}/)[1];

        // Substitua pela propriedade correspondente do arquivo JSON
        if (jsonData.hasOwnProperty(envVar)) {
            yamlData[key] = yamlData[key].replace(`\${${envVar}}`, jsonData[envVar]);
        }
    }
}

// Escreva o YAML atualizado de volta para o arquivo
fs.writeFileSync(path.join(__dirname, 'file.yml'), yaml.dump(yamlData));


//npm install js-yaml
