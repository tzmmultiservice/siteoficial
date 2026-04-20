// Supabase Edge Function: send-notification
// Deploy com: supabase functions deploy send-notification
//
// Env vars necessárias no Supabase Dashboard > Edge Functions > Secrets:
//   RESEND_API_KEY = re_...
//
// Chamar via supabase.functions.invoke('send-notification', { body: {...} })

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = "TZM Multi Service <noreply@tzmmultiservice.com.br>";

interface NotificationPayload {
  to: string;
  customerName: string;
  subject: string;
  status: string;
  trackingId: string;
  serviceName: string;
  appointmentDate: string;
  timeSlot: string;
  totalValue?: number;
  clientNotes?: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const payload: NotificationPayload = await req.json();
    const {
      to,
      customerName,
      subject,
      status,
      trackingId,
      serviceName,
      appointmentDate,
      timeSlot,
      totalValue,
      clientNotes,
    } = payload;

    if (!to || !customerName || !trackingId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const trackingUrl = `https://tzmmultiservice.com.br/acompanhar/${trackingId}`;

    const statusLabels: Record<string, string> = {
      pending: "🟡 Agendado",
      confirmed: "🔵 Confirmado",
      in_progress: "🟠 Em Atendimento",
      done: "🟢 Pronto para Retirada",
      cancelled: "🔴 Cancelado",
    };

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #CC3300, #E65C00, #FFB800); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">TZM Multi Service</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0;">Mecânica Automotiva</p>
        </div>
        <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 12px 12px;">
          <p style="font-size: 16px; color: #333;">Olá <strong>${customerName}</strong>,</p>
          <p style="font-size: 15px; color: #555;">Atualização sobre seu agendamento:</p>
          <div style="background: white; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 8px 0;"><strong>Status:</strong> ${statusLabels[status] || status}</p>
            <p style="margin: 8px 0;"><strong>Serviço:</strong> ${serviceName}</p>
            <p style="margin: 8px 0;"><strong>Data:</strong> ${appointmentDate} às ${timeSlot}</p>
            ${totalValue ? `<p style="margin: 8px 0;"><strong>Valor:</strong> R$ ${totalValue.toFixed(2)}</p>` : ""}
            ${clientNotes ? `<p style="margin: 8px 0;"><strong>Observações:</strong> ${clientNotes}</p>` : ""}
          </div>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${trackingUrl}" style="background: linear-gradient(135deg, #CC3300, #E65C00); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
              Acompanhar Serviço
            </a>
          </div>
          <p style="font-size: 13px; color: #999; text-align: center;">
            Dúvidas? Fale conosco no WhatsApp: (74) 99908-5246
          </p>
        </div>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    });

    const result = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: result }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
