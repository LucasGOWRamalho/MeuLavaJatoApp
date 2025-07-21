export type StatusServico = 'fazer' | 'concluido' | 'cobrar' | 'cancelado';

export interface Cliente {
  id: string;
  nome: string;
  carro: string;
  placa: string;
  contato?: string;
  servico: string;
  valor: string;
  dataEntrada: string;
  status: StatusServico;
}