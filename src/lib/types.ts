export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "done"
  | "cancelled";

export interface Service {
  id: string;
  name: string;
  description: string;
  price_estimate: number;
  duration_minutes: number;
  icon: string;
  active: boolean;
  created_at: string;
}

export interface Appointment {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  car_brand: string;
  car_model: string;
  car_year: number;
  car_plate: string | null;
  service_id: string;
  service?: Service;
  appointment_date: string;
  time_slot: string;
  status: AppointmentStatus;
  total_value: number | null;
  admin_notes: string | null;
  client_notes: string | null;
  tracking_id: string;
  created_at: string;
  updated_at: string;
}

export interface PieceInterest {
  id: string;
  email: string;
  created_at: string;
}

export interface BookingFormData {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  car_brand: string;
  car_model: string;
  car_year: string;
  car_plate: string;
  service_id: string;
  appointment_date: string;
  time_slot: string;
}
