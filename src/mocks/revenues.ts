export type RevenuePeriodRow = {
  period: string
  premium: number
  pro: number
  total: string
}

export type RevenueSummary = {
  payments: { name: string; value: number; color: string }[]
  series: { month: string; premium: number; pro: number }[]
}

export const REVENUE_PERIODS: RevenuePeriodRow[] = [
  { period: 'Feb 2025', premium: 66, pro: 0, total: '3,647.11 €' },
  { period: 'Mar 2025', premium: 43, pro: 0, total: '2,588.44 €' },
  { period: 'Abr 2025', premium: 49, pro: 0, total: '8,944.65 €' },
  { period: 'May 2025', premium: 47, pro: 0, total: '718.80 €' },
  { period: 'Jun 2025', premium: 29, pro: 0, total: '8,950.2 €' },
  { period: 'Jul 2025', premium: 15, pro: 0, total: '8,639.65 €' },
  { period: 'Ago 2025', premium: 30, pro: 0, total: '3,056.90 €' },
  { period: 'Sep 2025', premium: 54, pro: 0, total: '1,331.97 €' },
  { period: 'Oct 2025', premium: 54, pro: 0, total: '653.66 €' },
  { period: 'Nov 2025', premium: 40, pro: 0, total: '619.77 €' },
]

export const REVENUE_SUMMARY: RevenueSummary = {
  payments: [
    { name: 'GPay', value: 45, color: '#4C51C6' },
    { name: 'Apple Pay', value: 30, color: '#9AA3E1' },
    { name: 'Stripe', value: 25, color: '#BFC6F0' },
  ],
  series: [
    { month: 'Jan', premium: 12, pro: 8 },
    { month: 'Feb', premium: 18, pro: 12 },
    { month: 'Mar', premium: 30, pro: 25 },
    { month: 'Abr', premium: 20, pro: 25 },
    { month: 'May', premium: 12, pro: 8 },
  ],
}

export type RevenueCharge = { name: string; method: string; amount: string; plan: 'Premium' | 'Pro' }

export function getRevenueDetail(period: string) {
  // Simular API real con datos diferentes por período
  const periodData: Record<string, { premium: number; pro: number; total: string; charges: RevenueCharge[] }> = {
    'Feb 2025': {
      premium: 12,
      pro: 5,
      total: '3,647.11 €',
      charges: [
        { name: 'María Santos', method: 'Google Pay', amount: '251.50 €', plan: 'Premium' },
        { name: 'Juan Pérez', method: 'Apple Pay', amount: '199.99 €', plan: 'Pro' },
        { name: 'Luisa Gómez', method: 'Stripe', amount: '349.00 €', plan: 'Premium' },
        { name: 'Carlos Ruiz', method: 'Google Pay', amount: '120.75 €', plan: 'Premium' },
        { name: 'Ana Torres', method: 'Apple Pay', amount: '89.90 €', plan: 'Pro' },
        { name: 'Pedro Lima', method: 'Stripe', amount: '430.00 €', plan: 'Premium' },
        { name: 'Lucía Vega', method: 'Google Pay', amount: '299.00 €', plan: 'Premium' },
        { name: 'Sofía Núñez', method: 'Apple Pay', amount: '159.50 €', plan: 'Pro' },
        { name: 'Diego León', method: 'Stripe', amount: '520.10 €', plan: 'Premium' },
        { name: 'Patricia Mora', method: 'Google Pay', amount: '240.00 €', plan: 'Premium' },
      ]
    },
    'Mar 2025': {
      premium: 8,
      pro: 7,
      total: '2,588.44 €',
      charges: [
        { name: 'Roberto Silva', method: 'Apple Pay', amount: '180.25 €', plan: 'Pro' },
        { name: 'Carmen Díaz', method: 'Google Pay', amount: '320.00 €', plan: 'Premium' },
        { name: 'Miguel Torres', method: 'Stripe', amount: '95.50 €', plan: 'Pro' },
        { name: 'Elena Ruiz', method: 'Apple Pay', amount: '275.75 €', plan: 'Premium' },
        { name: 'Fernando López', method: 'Google Pay', amount: '150.00 €', plan: 'Pro' },
        { name: 'Isabel Moreno', method: 'Stripe', amount: '400.25 €', plan: 'Premium' },
        { name: 'Antonio García', method: 'Apple Pay', amount: '220.50 €', plan: 'Pro' },
        { name: 'Rosa Martín', method: 'Google Pay', amount: '180.00 €', plan: 'Premium' },
        { name: 'Javier Herrera', method: 'Stripe', amount: '310.75 €', plan: 'Pro' },
        { name: 'Mónica Castro', method: 'Apple Pay', amount: '250.00 €', plan: 'Premium' },
      ]
    },
    'Abr 2025': {
      premium: 15,
      pro: 3,
      total: '8,944.65 €',
      charges: [
        { name: 'Alejandro Vega', method: 'Google Pay', amount: '450.00 €', plan: 'Premium' },
        { name: 'Natalia Ramos', method: 'Stripe', amount: '380.25 €', plan: 'Premium' },
        { name: 'Héctor Morales', method: 'Apple Pay', amount: '200.50 €', plan: 'Pro' },
        { name: 'Valeria Jiménez', method: 'Google Pay', amount: '520.75 €', plan: 'Premium' },
        { name: 'Sebastián Ortega', method: 'Stripe', amount: '150.00 €', plan: 'Pro' },
        { name: 'Camila Vargas', method: 'Apple Pay', amount: '600.25 €', plan: 'Premium' },
        { name: 'Andrés Mendoza', method: 'Google Pay', amount: '320.50 €', plan: 'Premium' },
        { name: 'Gabriela Peña', method: 'Stripe', amount: '180.75 €', plan: 'Pro' },
        { name: 'Ricardo Flores', method: 'Apple Pay', amount: '750.00 €', plan: 'Premium' },
        { name: 'Daniela Rojas', method: 'Google Pay', amount: '420.25 €', plan: 'Premium' },
      ]
    }
  }

  // Si no existe el período, devolver datos por defecto
  const data = periodData[period] || {
    premium: 5,
    pro: 2,
    total: '1,200.00 €',
    charges: [
      { name: 'Usuario Genérico', method: 'Google Pay', amount: '150.00 €', plan: 'Premium' },
      { name: 'Cliente Demo', method: 'Apple Pay', amount: '200.00 €', plan: 'Pro' },
    ]
  }

  return { period, ...data }
}


