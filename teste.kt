fun main(args: Array<String>) {
    println("Hello World!")

    val mapa = mapOf(
        "Erro de sintaxe inesperado na linha {d} da unidade {d}" to "Falha na autenticação do usuário",
        "Erro de divisão por zero na linha {d}" to "Falha na conexão com o servidor",
        "Erro de falta de memória no endereço {d}" to "Erro de tempo limite de solicitação",
        "Erro de arquivo {d} não encontrado na unidade {d}" to "Erro de permissão negada",
        "Erro de disco cheio na unidade {d} da esquina" to "Erro de recurso não disponível"
    ).mapKeys { it.key.split("{d}") }

    // Função para substituir a mensagem antiga pela nova
    fun replaceOldMessageWithNew(oldMessage: String): String {
        return mapa.filter {
            it.key.all { el ->
                val textoSemEspacoBranco = el.trim()
                oldMessage.contains(textoSemEspacoBranco, true)
            }
        }.values.firstOrNull() ?: oldMessage
    }

    // Testando a função
    val oldMessage = listOf(
        "Erro de sintaxe inesperado na linha 1894 da unidade 999",
        "Erro de arquivo birolinha não encontrado na unidade C",
        "Erro de disco cheio na unidade 01293 da esquina"
    )

    oldMessage.forEach {

        println("\nA nova mensagem é '${replaceOldMessageWithNew(it)}'")

    }


}
