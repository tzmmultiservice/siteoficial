import { COMPANY } from "./constants";

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

export function getWhatsAppLink(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, "");
  const num = digits.startsWith("55") ? digits : `55${digits}`;
  const msg = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${num}${msg}`;
}

export function getClientNotifyMessage(
  status: string,
  customerName: string,
  carModel: string,
  trackingId: string,
  value?: number | null
): string {
  const link = `${typeof window !== "undefined" ? window.location.origin : "https://tzmmultiservice.com.br"}/acompanhar/${trackingId}`;
  const name = customerName.split(" ")[0];

  switch (status) {
    case "confirmed":
      return `Olá ${name}! Seu agendamento na TZM está *confirmado* ✅\n\nAcompanhe aqui: ${link}`;
    case "in_progress":
      return `Olá ${name}! Seu veículo ${carModel} está sendo atendido agora 🔧\n\nAcompanhe em tempo real: ${link}`;
    case "done":
      return `Olá ${name}! Seu veículo ${carModel} está *pronto para retirada*! ✅${value ? `\n\nValor: R$ ${value.toFixed(2)}` : ""}\n\nDetalhes: ${link}`;
    case "cancelled":
      return `Olá ${name}, infelizmente seu agendamento na TZM foi cancelado.\n\nEntre em contato para remarcar: ${COMPANY.phone}`;
    default:
      return `Olá ${name}, sobre seu agendamento na TZM...\n\n${link}`;
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function isSaturday(dateStr: string): boolean {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).getDay() === 6;
}

export function isSunday(dateStr: string): boolean {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).getDay() === 0;
}
