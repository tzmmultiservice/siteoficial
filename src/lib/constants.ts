import type { Service } from "./types";

export const COMPANY = {
  name: "TZM Multi Service",
  tagline: "Mecânica Automotiva",
  fullName: "TZM Multi Service — Mecânica Automotiva",
  address: "Av. Dois de Julho, n° 169 — São Gabriel, BA, 44915-000",
  phone: "(74) 99908-5246",
  phoneClean: "5574999085246",
  email: "tzm.multiservices25@gmail.com",
  whatsappLink: "https://wa.me/5574999085246?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20TZM!",
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3867.0!2d-38.8975!3d-11.8583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAv.+Dois+de+Julho%2C+169+-+S%C3%A3o+Gabriel%2C+BA!5e0!3m2!1spt-BR!2sbr",
  hours: {
    weekdays: "Seg–Sex: 8h às 18h",
    saturday: "Sáb: 8h às 12h",
    sunday: "Dom: Fechado",
  },
} as const;

export const TIME_SLOTS_WEEKDAY = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
];

export const TIME_SLOTS_SATURDAY = [
  "08:00", "09:00", "10:00", "11:00",
];

export const PLACEHOLDER_SERVICES: Omit<Service, "id" | "created_at">[] = [
  {
    name: "Troca de Óleo",
    description: "Troca de óleo e filtro completa para manter seu motor protegido.",
    price_estimate: 150,
    duration_minutes: 60,
    icon: "droplets",
    active: true,
  },
  {
    name: "Revisão Completa",
    description: "Revisão dos principais sistemas do veículo com checklist completo.",
    price_estimate: 350,
    duration_minutes: 180,
    icon: "clipboard-check",
    active: true,
  },
  {
    name: "Suspensão",
    description: "Diagnóstico e reparo do sistema de suspensão para mais conforto e segurança.",
    price_estimate: 400,
    duration_minutes: 120,
    icon: "car",
    active: true,
  },
  {
    name: "Freios",
    description: "Troca de pastilhas, discos e revisão completa do sistema de frenagem.",
    price_estimate: 280,
    duration_minutes: 90,
    icon: "shield-check",
    active: true,
  },
  {
    name: "Alinhamento e Balanceamento",
    description: "Alinhamento de direção e balanceamento de rodas para mais estabilidade.",
    price_estimate: 120,
    duration_minutes: 60,
    icon: "crosshair",
    active: true,
  },
  {
    name: "Diagnóstico Eletrônico",
    description: "Scanner e diagnóstico computadorizado para identificar falhas.",
    price_estimate: 100,
    duration_minutes: 45,
    icon: "cpu",
    active: true,
  },
  {
    name: "Ar Condicionado",
    description: "Manutenção, limpeza e recarga do sistema de ar condicionado.",
    price_estimate: 200,
    duration_minutes: 90,
    icon: "wind",
    active: true,
  },
  {
    name: "Embreagem",
    description: "Troca e regulagem do kit de embreagem com peças de qualidade.",
    price_estimate: 600,
    duration_minutes: 240,
    icon: "settings",
    active: true,
  },
];

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string; emoji: string }
> = {
  pending: {
    label: "Agendado",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
    emoji: "🟡",
  },
  confirmed: {
    label: "Confirmado",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    emoji: "🔵",
  },
  in_progress: {
    label: "Em Atendimento",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    emoji: "🟠",
  },
  done: {
    label: "Pronto",
    color: "text-green-700",
    bgColor: "bg-green-100",
    emoji: "🟢",
  },
  cancelled: {
    label: "Cancelado",
    color: "text-red-700",
    bgColor: "bg-red-100",
    emoji: "🔴",
  },
};

export const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/servicos", label: "Serviços" },
  { href: "/agendar", label: "Agendar" },
  { href: "/pecas", label: "Peças" },
  { href: "/contato", label: "Contato" },
];

export const CAR_BRANDS = [
  "Chevrolet", "Fiat", "Ford", "Honda", "Hyundai", "Jeep",
  "Nissan", "Peugeot", "Renault", "Toyota", "Volkswagen", "Outra",
];
