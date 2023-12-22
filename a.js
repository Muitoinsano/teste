



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
            if (envVar === 'IMG') {
                yamlLines[i] = yamlLines[i].replace(`\${${envVar}}`, 'IMG');
            } else if (jsonData.hasOwnProperty(envVar)) {
                yamlLines[i] = yamlLines[i].replace(`\${${envVar}}`, jsonData[envVar]);
            }
        }
    }

    // Junte as linhas atualizadas de volta em uma string
    const updatedYaml = yamlLines.join('\n');

    // Crie um subdiretório para o ambiente atual se ele não existir
    const envDir = path.join(outputDir, path.basename(file, '.json'));
    if (!fs.existsSync(envDir)) {
        fs.mkdirSync(envDir);
    }

    // Escreva o YAML atualizado para um novo arquivo no subdiretório do ambiente
    fs.writeFileSync(path.join(envDir, 'kubernetes.yml'), updatedYaml);
}


console.log("Finalizado a criação dos arquivos kubernetes.yml por ambiente")















import kotlinx.io.*
import kotlinx.serialization.json.*
import java.io.File
import java.nio.file.Files
import java.nio.file.Paths

// Lista de arquivos JSON para ler
val jsonFiles = listOf("dev.json", "hom.json", "prod.json")

// Crie o diretório de saída se ele não existir
val outputDir = Paths.get(System.getProperty("user.dir"), "env-results")
if (!Files.exists(outputDir)) {
    Files.createDirectory(outputDir)
}

// Percorra cada arquivo JSON
for (file in jsonFiles) {
    // Carregue o arquivo JSON
    val jsonFile = File(Paths.get(System.getProperty("user.dir"), "env", file).toString()).readText()
    val jsonData = Json.parseToJsonElement(jsonFile).jsonObject["Parametros"]?.jsonObject

    // Carregue o arquivo YAML
    val yamlFile = File(Paths.get(System.getProperty("user.dir"), "app.yml").toString()).readText()
    var yamlLines = yamlFile.lines().toMutableList()

    // Percorra cada linha do arquivo YAML
    for (i in yamlLines.indices) {
        if (yamlLines[i].contains("\${")) {
            // Encontre a variável de ambiente
            val envVar = Regex("\\\${(.*)}").find(yamlLines[i])?.groups?.get(1)?.value

            // Substitua pela propriedade correspondente do arquivo JSON
            if (jsonData?.containsKey(envVar) == true) {
                yamlLines[i] = yamlLines[i].replace("\${$envVar}", jsonData[envVar].toString())
            }
        }
    }

    // Junte as linhas atualizadas de volta em uma string
    val updatedYaml = yamlLines.joinToString("\n")

    // Crie um subdiretório para o ambiente atual se ele não existir
    val envDir = Paths.get(outputDir.toString(), file.substringBefore(".json"))
    if (!Files.exists(envDir)) {
        Files.createDirectory(envDir)
    }

    // Escreva o YAML atualizado para um novo arquivo no subdiretório do ambiente
    File(Paths.get(envDir.toString(), "result.yml").toString()).writeText(updatedYaml)
}
