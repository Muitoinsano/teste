const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'registros.json');

// Função para obter a data no formato 'dd-MM-AAAA'
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
}

// Função para obter o nome da rede Wi-Fi conectada no Windows
function getConnectedWifiName() {
  return new Promise((resolve, reject) => {
    exec('netsh wlan show interfaces', (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      // Encontrar a linha que contém o nome da rede Wi-Fi
      const match = /SSID\s+: (.+)/.exec(stdout);
      if (match && match[1]) {
        resolve(match[1].trim());
      } else {
        reject(new Error("Não foi possível encontrar o nome da rede Wi-Fi."));
      }
    });
  });
}

// Função para ler o arquivo JSON de registros
function readRecordsFromFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve([]);
        } else {
          reject(err);
        }
      } else {
        try {
          resolve(JSON.parse(data));
        } catch (parseError) {
          reject(parseError);
        }
      }
    });
  });
}

// Função para escrever registros no arquivo JSON
function writeRecordsToFile(records) {
  return new Promise((resolve, reject) => {
    fs.writeFile(FILE_PATH, JSON.stringify(records, null, 2), 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Função principal para obter o nome da rede Wi-Fi e registrar no arquivo JSON
async function recordConnectedWifiName() {
  try {
    // Obter o nome da rede Wi-Fi conectada
    const wifiName = await getConnectedWifiName();
    const currentDate = getCurrentDate();

    // Ler registros existentes do arquivo
    let records = await readRecordsFromFile();

    // Contar registros com nome de Wi-Fi "sp0" dentro do intervalo do mês atual
    const currentMonth = new Date().getMonth() + 1;
    const count = records.filter(record => {
      const recordMonth = new Date(record.date).getMonth() + 1;
      return recordMonth === currentMonth && record.wifiName === "sp0";
    }).length;

    // Criar novo objeto com a contagem e o mês atual
    const monthRecord = { month: currentMonth, count };

    // Escrever objeto de contagem no arquivo JSON
    await fs.promises.writeFile('count.json', JSON.stringify(monthRecord, null, 2));

    // Verificar se já existe um registro para a mesma data e nome da rede
    const existingRecord = records.find(record => record.date === currentDate && record.wifiName === wifiName);
    if (existingRecord) {
      console.log("Já existe um registro para a mesma data e nome da rede.");
      return;
    }

    // Adicionar novo registro
    const newRecord = { date: currentDate, wifiName };
    records.push(newRecord);

    // Escrever registros atualizados no arquivo
    await writeRecordsToFile(records);

    console.log("Registro salvo com sucesso.");
  } catch (error) {
    console.error("Erro ao registrar o nome da rede Wi-Fi:", error);
  }
}

// Registrar o nome da rede Wi-Fi conectada
recordConnectedWifiName();
