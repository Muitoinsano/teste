const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

// Carregue o arquivo JSON
const jsonFile = fs.readFileSync(path.join(__dirname, 'file.json'));
const jsonData = JSON.parse(jsonFile).Parametros;

// Carregue o arquivo YAML
const yamlFile = fs.readFileSync(path.join(__dirname, 'file.yml'), 'utf8');
let yamlData = yaml.load(yamlFile);

// Função para percorrer todos os nós do objeto YAML
function replaceEnvVars(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'string' && obj[key].includes('${')) {
            // Encontre a variável de ambiente
            const envVar = obj[key].match(/\${(.*)}/)[1];

            // Substitua pela propriedade correspondente do arquivo JSON
            if (jsonData.hasOwnProperty(envVar)) {
                obj[key] = obj[key].replace(`\${${envVar}}`, jsonData[envVar]);
            }
        } else if (typeof obj[key] === 'object') {
            // Se o valor for um objeto, percorra seus nós
            replaceEnvVars(obj[key]);
        }
    }
}

// Chame a função no objeto YAML
replaceEnvVars(yamlData);

// Escreva o YAML atualizado de volta para o arquivo
fs.writeFileSync(path.join(__dirname, 'file.yml'), yaml.dump(yamlData));
