exports.formatarData = (data) => {
  if (!data || isNaN(new Date(data).getTime())) {
    return 'Data inválida';
  }
  return new Date(data).toLocaleString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};
