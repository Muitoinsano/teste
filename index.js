const fs = require('fs');
const path = require('path');

// Lista de arquivos JSON para ler
const jsonFiles = ['dev.json', 'hom.json', 'prod.json'];

// Crie o diretório de saída se ele não existir
const outputDir = path.join(__dirname, 'env-results');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Percorra cada arquivo JSON
for (let file of jsonFiles) {
    // Carregue o arquivo JSON
    const jsonFile = fs.readFileSync(path.join(__dirname, 'env', file));
    const jsonData = JSON.parse(jsonFile).Parametros;

    // Carregue o arquivo YAML
    const yamlFile = fs.readFileSync(path.join(__dirname, 'app.yml'), 'utf8');
    let yamlLines = yamlFile.split('\n');

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

    // Escreva o YAML atualizado para um novo arquivo na pasta de saída
    fs.writeFileSync(path.join(outputDir, file.replace('.json', '-result.yml')), updatedYaml);
}
