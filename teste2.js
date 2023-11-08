const fs = require('fs');
const path = require('path');

// Carregue o arquivo JSON
const jsonFile = fs.readFileSync(path.join(__dirname, 'file.json'));
const jsonData = JSON.parse(jsonFile).Parametros;

// Carregue o arquivo YAML
const yamlFile = fs.readFileSync(path.join(__dirname, 'file.yml'), 'utf8');
const yamlLines = yamlFile.split('\n');

// Percorra cada linha do arquivo YAML
for (let i = 0; i < yamlLines.length; i++) {
    if (yamlLines[i].includes('${')) {
        // Encontre a variável de ambiente
        const envVar = yamlLines[i].match(/\${(.*)}/)[1];

        // Substitua pela propriedade correspondente do arquivo JSON
        if (jsonData.hasOwnProperty(envVar)) {
            yamlLines[i] = yamlLines[i].replace(`\${${envVar}}`, jsonData[envVar]);
        }
    }
}

// Junte as linhas atualizadas de volta em uma string
const updatedYaml = yamlLines.join('\n');

// Escreva o YAML atualizado para um novo arquivo
fs.writeFileSync(path.join(__dirname, 'resultado.yml'), updatedYaml);
