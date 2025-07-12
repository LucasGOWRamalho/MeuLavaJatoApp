export type StatusServico = 'fazer' | 'concluido' | 'cobrar' | 'cancelado' | 'pago';

export interface Cliente {
  id: string;
  nome: string;
  carro: string;
  placa: string;
  servico: string;
  valor: string;
  dataEntrada: string;
  status: StatusServico;
}