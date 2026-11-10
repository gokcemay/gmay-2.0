import { z } from 'zod';

export const contactReasons = ['general', 'training', 'consulting', 'research', 'industry', 'speaking', 'other'] as const;
const line = (max: number) => z.string().trim().min(1).max(max).refine(value => !/[\r\n\u0000]/.test(value));
export const contactSchema = z.object({
  name: line(120),
  email: z.string().trim().email().max(254),
  organization: z.string().trim().max(160).refine(value => !/[\r\n\u0000]/.test(value)),
  subject: line(200),
  message: z.string().trim().min(1).max(5000).refine(value => !value.includes('\u0000')),
  reason: z.enum(['', ...contactReasons]),
  consent: z.literal(true),
  website: z.string().max(200),
  submissionId: z.string().uuid(),
}).strict();
export type ContactSubmission = z.infer<typeof contactSchema>;
export const reasonNames: Record<string, string> = {
  general: 'General inquiry', training: 'Training', consulting: 'Consulting',
  research: 'Research collaboration', industry: 'Industry collaboration', speaking: 'Speaking / event', other: 'Other',
};

export function contactEmail(data: ContactSubmission, timestamp: string) {
  const reason = reasonNames[data.reason] ?? '';
  const subject = `[gmay.me Contact] ${reason ? `${reason} — ` : ''}${data.subject}`;
  const rows = [['Name', data.name], ['Email', data.email], ['Organization', data.organization || '—'], ['Contact reason', reason || '—'], ['Subject', data.subject], ['Message', data.message], ['Submitted from', 'gmay.me'], ['Submission time', timestamp]];
  const escape = (value: string) => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);
  return {
    subject,
    text: rows.map(([label, value]) => `${label}:\n${value}`).join('\n\n'),
    html: `<html><body><h1>gmay.me Contact</h1>${rows.map(([label, value]) => `<p><strong>${label}:</strong><br>${escape(value ?? '').replace(/\n/g, '<br>')}</p>`).join('')}</body></html>`,
  };
}