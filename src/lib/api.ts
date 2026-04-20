import { supabase } from "./supabase";
import type { Service, Appointment, AppointmentStatus, BookingFormData } from "./types";

// ============ SERVICES ============

export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("active", true)
    .order("created_at");
  if (error) throw error;
  return data ?? [];
}

export async function fetchAllServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at");
  if (error) throw error;
  return data ?? [];
}

export async function updateService(
  id: string,
  updates: Partial<Pick<Service, "name" | "description" | "price_estimate" | "duration_minutes" | "active">>
) {
  const { error } = await supabase.from("services").update(updates).eq("id", id);
  if (error) throw error;
}

// ============ APPOINTMENTS ============

export async function createAppointment(form: BookingFormData): Promise<Appointment> {
  const { data, error } = await supabase
    .from("appointments")
    .insert({
      customer_name: form.customer_name,
      customer_phone: form.customer_phone,
      customer_email: form.customer_email || null,
      car_brand: form.car_brand,
      car_model: form.car_model,
      car_year: parseInt(form.car_year, 10),
      car_plate: form.car_plate || null,
      service_id: form.service_id,
      appointment_date: form.appointment_date,
      time_slot: form.time_slot,
    })
    .select()
    .single();
  if (error) {
    if (error.code === "23505") {
      throw new Error("SLOT_TAKEN");
    }
    throw error;
  }
  return data;
}

export async function fetchAppointmentByTracking(trackingId: string): Promise<Appointment | null> {
  const { data, error } = await supabase
    .from("appointments")
    .select("*, service:services(*)")
    .eq("tracking_id", trackingId)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw error;
  }
  return data;
}

export async function fetchAppointments(status?: string): Promise<Appointment[]> {
  let query = supabase
    .from("appointments")
    .select("*, service:services(*)")
    .order("appointment_date", { ascending: false });
  if (status && status !== "all") {
    query = query.eq("status", status);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function updateAppointmentDetails(
  id: string,
  updates: {
    total_value?: number | null;
    admin_notes?: string | null;
    client_notes?: string | null;
    responsible_mechanic?: string | null;
    yard_name?: string | null;
    progress_percent?: number;
  }
) {
  const { error } = await supabase
    .from("appointments")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
}

export async function fetchBookedSlots(date: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("appointments")
    .select("time_slot")
    .eq("appointment_date", date)
    .neq("status", "cancelled");
  if (error) throw error;
  return (data ?? []).map((row) => row.time_slot);
}

// ============ PIECE INTERESTS ============

export async function createPieceInterest(email: string) {
  const { error } = await supabase.from("piece_interests").insert({ email });
  if (error) throw error;
}

// ============ STATS ============

export async function fetchDashboardStats() {
  const today = new Date().toISOString().split("T")[0];
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekStartStr = weekStart.toISOString().split("T")[0];

  const [pending, confirmed, inProgress, done, todayCount, weekCount] =
    await Promise.all([
      supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "confirmed"),
      supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "in_progress"),
      supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "done"),
      supabase.from("appointments").select("id", { count: "exact", head: true }).eq("appointment_date", today),
      supabase.from("appointments").select("id", { count: "exact", head: true }).gte("appointment_date", weekStartStr),
    ]);

  return {
    pending: pending.count ?? 0,
    confirmed: confirmed.count ?? 0,
    in_progress: inProgress.count ?? 0,
    done: done.count ?? 0,
    today: todayCount.count ?? 0,
    this_week: weekCount.count ?? 0,
  };
}

export interface OwnerYardOverview {
  yard_name: string;
  total: number;
  waiting: number;
  active: number;
  done: number;
  cancelled: number;
}

export interface OwnerOverview {
  total_cars: number;
  active_services: number;
  waiting_services: number;
  completed_this_week: number;
  avg_progress: number;
  monthly_revenue: number;
  yards: OwnerYardOverview[];
}

export async function fetchOwnerOverview(): Promise<OwnerOverview> {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekStartStr = weekStart.toISOString().split("T")[0];

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const { data, error } = await supabase
    .from("appointments")
    .select("status, yard_name, progress_percent, total_value, appointment_date");

  if (error) throw error;

  const rows = data ?? [];
  const totalCars = rows.length;
  const waitingServices = rows.filter((a) => a.status === "pending" || a.status === "confirmed").length;
  const activeServices = rows.filter((a) => a.status === "in_progress").length;
  const completedThisWeek = rows.filter(
    (a) => a.status === "done" && a.appointment_date >= weekStartStr
  ).length;

  const monthRevenue = rows.reduce((acc, row) => {
    if (row.status === "done" && row.appointment_date >= monthStart && row.total_value) {
      return acc + Number(row.total_value);
    }
    return acc;
  }, 0);

  const avgProgress = totalCars
    ? Math.round(rows.reduce((acc, row) => acc + Number(row.progress_percent || 0), 0) / totalCars)
    : 0;

  const yardMap = new Map<string, OwnerYardOverview>();
  for (const row of rows) {
    const yard = row.yard_name || "Pátio Principal";
    if (!yardMap.has(yard)) {
      yardMap.set(yard, {
        yard_name: yard,
        total: 0,
        waiting: 0,
        active: 0,
        done: 0,
        cancelled: 0,
      });
    }
    const current = yardMap.get(yard)!;
    current.total += 1;
    if (row.status === "pending" || row.status === "confirmed") current.waiting += 1;
    if (row.status === "in_progress") current.active += 1;
    if (row.status === "done") current.done += 1;
    if (row.status === "cancelled") current.cancelled += 1;
  }

  return {
    total_cars: totalCars,
    active_services: activeServices,
    waiting_services: waitingServices,
    completed_this_week: completedThisWeek,
    avg_progress: avgProgress,
    monthly_revenue: monthRevenue,
    yards: Array.from(yardMap.values()).sort((a, b) => b.total - a.total),
  };
}

// ============ REALTIME ============

export function subscribeToAppointment(
  trackingId: string,
  callback: (appointment: Appointment) => void
) {
  return supabase
    .channel(`tracking-${trackingId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "appointments",
        filter: `tracking_id=eq.${trackingId}`,
      },
      (payload) => {
        callback(payload.new as Appointment);
      }
    )
    .subscribe();
}
