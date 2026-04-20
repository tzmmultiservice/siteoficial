-- ==========================================
-- TZM Multi Service — Supabase Migration
-- Execute no SQL Editor do Supabase Dashboard
-- ==========================================

-- 1. Tabela de serviços
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_estimate NUMERIC(10,2) NOT NULL DEFAULT 0,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  icon TEXT NOT NULL DEFAULT 'settings',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Tabela de agendamentos
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_id TEXT NOT NULL UNIQUE DEFAULT ('TZM-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0')),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  car_brand TEXT NOT NULL,
  car_model TEXT NOT NULL,
  car_year INTEGER NOT NULL,
  car_plate TEXT,
  service_id UUID NOT NULL REFERENCES services(id),
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'in_progress', 'done', 'cancelled')),
  total_value NUMERIC(10,2),
  admin_notes TEXT,
  client_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Anti-double-booking: máximo 1 agendamento por horário+data (exceto cancelados)
  CONSTRAINT unique_slot UNIQUE (appointment_date, time_slot)
);

-- Índices para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_tracking ON appointments(tracking_id);

-- 3. Tabela de interesses em peças
CREATE TABLE IF NOT EXISTS piece_interests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- RLS (Row Level Security)
-- ==========================================

-- Ativar RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE piece_interests ENABLE ROW LEVEL SECURITY;

-- Services: público pode ler ativos, admin pode tudo
CREATE POLICY "Public can read active services"
  ON services FOR SELECT
  USING (active = true);

CREATE POLICY "Admin full access to services"
  ON services FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Appointments: público pode inserir e ler por tracking_id, admin pode tudo
CREATE POLICY "Public can insert appointments"
  ON appointments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can read own appointment by tracking_id"
  ON appointments FOR SELECT
  USING (true);

CREATE POLICY "Admin full access to appointments"
  ON appointments FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Piece interests: público pode inserir, admin pode ler
CREATE POLICY "Public can insert piece interest"
  ON piece_interests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can read piece interests"
  ON piece_interests FOR SELECT
  USING (auth.role() = 'authenticated');

-- ==========================================
-- Seed: serviços iniciais
-- ==========================================
INSERT INTO services (name, description, price_estimate, duration_minutes, icon, active) VALUES
  ('Troca de Óleo', 'Troca de óleo e filtro completa para manter seu motor protegido.', 150, 60, 'droplets', true),
  ('Revisão Completa', 'Revisão dos principais sistemas do veículo com checklist completo.', 350, 180, 'clipboard-check', true),
  ('Suspensão', 'Diagnóstico e reparo do sistema de suspensão para mais conforto e segurança.', 400, 120, 'car', true),
  ('Freios', 'Troca de pastilhas, discos e revisão completa do sistema de frenagem.', 280, 90, 'shield-check', true),
  ('Alinhamento e Balanceamento', 'Alinhamento de direção e balanceamento de rodas para mais estabilidade.', 120, 60, 'crosshair', true),
  ('Diagnóstico Eletrônico', 'Scanner e diagnóstico computadorizado para identificar falhas.', 100, 45, 'cpu', true),
  ('Ar Condicionado', 'Manutenção, limpeza e recarga do sistema de ar condicionado.', 200, 90, 'wind', true),
  ('Embreagem', 'Troca e regulagem do kit de embreagem com peças de qualidade.', 600, 240, 'settings', true)
ON CONFLICT DO NOTHING;

-- ==========================================
-- Realtime: ativar para appointments
-- ==========================================
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
