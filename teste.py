import time
import threading
import requests

class TokenManager:
    def __init__(self):
        self.token = None
        self.expiry_time = 0
        self.lock = threading.Lock()
        self.renew_thread = threading.Thread(target=self._auto_renew_token, daemon=True)
        self.renew_thread.start()

    def _get_new_token(self):
        """Chama a API do fornecedor para obter um novo token"""
        response = requests.post("https://api.fornecedor.com/auth", json={"client_id": "xxx", "client_secret": "yyy"})
        data = response.json()
        return data["access_token"], time.time() + 1800  # 30 minutos

    def _auto_renew_token(self):
        """Executa um loop infinito para renovar o token antes da expiração"""
        while True:
            time.sleep(1500)  # Aguarda 25 minutos (1500 segundos)
            with self.lock:
                if time.time() >= self.expiry_time - 300:  # Se estiver próximo da expiração
                    self.token, self.expiry_time = self._get_new_token()

    def get_token(self):
        """Retorna um token válido"""
        with self.lock:
            if time.time() >= self.expiry_time - 300:  # Se faltar menos de 5 minutos, renova o token
                self.token, self.expiry_time = self._get_new_token()
            return self.token

# Criando uma instância do TokenManager
token_manager = TokenManager()




--------------------

def process_message(message):
    token = token_manager.get_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get("https://api.fornecedor.com/data", headers=headers)
    data = response.json()
    
    # Processar os dados e salvar no S3...