function status(request, response) {
  response.status(200).json({ chave: "valor - alunos são topperson" });
}

export default status;
