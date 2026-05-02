import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatBRL(n: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(n);
}

export function formatDate(d: string | Date, fmt = 'dd/MM/yyyy'): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return format(date, fmt, { locale: ptBR });
}
