// Função para formatar uma data em formato brasileiro
exports.formatarData = (data) => {
  // Verifica se a data é válida
  if (!data || isNaN(new Date(data).getTime())) {
    return 'Data inválida';
  }
  // Retorna a data formatada em pt-BR
  return new Date(data).toLocaleString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};
