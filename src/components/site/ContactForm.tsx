import { useRef, useState } from 'react';
import { Send, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/lib/i18n';
import { contactReasons, contactSchema } from '@/lib/contact.schema';

const empty = { name: '', email: '', organization: '', subject: '', message: '', reason: '', consent: false, website: '' };
const labels = {
  en: { name: 'Name', email: 'Email', organization: 'Organization / Company', subject: 'Subject', message: 'Message', reason: 'Contact reason', optional: 'Optional', select: 'Select a reason', consent: 'I agree that the information I provide may be used to respond to my message.', send: 'Send Message', sending: 'Sending...', success: 'Thank you. Your message has been sent successfully.', failure: 'Your message could not be sent. Please try again or contact me by email.', required: 'This field is required.', invalidEmail: 'Enter a valid email address.', long: 'Maximum length exceeded.', invalid: 'Please check this field.', consentError: 'Please agree before sending.', privacy: 'Messages are sent through Resend to gmehmetay@gmail.com. No message copy is stored on this website. Resend processes emails and retains delivery logs.' },
  tr: { name: 'Ad Soyad', email: 'E-posta', organization: 'Kurum / Şirket', subject: 'Konu', message: 'Mesaj', reason: 'İletişim nedeni', optional: 'İsteğe bağlı', select: 'Bir neden seçin', consent: 'Paylaştığım bilgilerin mesajıma yanıt vermek amacıyla kullanılmasını kabul ediyorum.', send: 'Mesaj Gönder', sending: 'Gönderiliyor...', success: 'Teşekkür ederim. Mesajınız başarıyla gönderildi.', failure: 'Mesajınız gönderilemedi. Lütfen tekrar deneyin veya e-posta ile iletişime geçin.', required: 'Bu alan zorunludur.', invalidEmail: 'Geçerli bir e-posta adresi girin.', long: 'En fazla karakter sınırı aşıldı.', invalid: 'Lütfen bu alanı kontrol edin.', consentError: 'Göndermeden önce onay vermelisiniz.', privacy: 'Mesajlar Resend aracılığıyla gmehmetay@gmail.com adresine gönderilir. Bu sitede mesaj kopyası saklanmaz. Resend e-postaları işler ve teslimat kayıtlarını tutar.' },
};
const reasons = {
  en: ['General inquiry', 'Training', 'Consulting', 'Research collaboration', 'Industry collaboration', 'Speaking / event', 'Other'],
  tr: ['Genel iletişim', 'Eğitim', 'Danışmanlık', 'Araştırma iş birliği', 'Sanayi iş birliği', 'Konuşma / etkinlik', 'Diğer'],
};

export function ContactForm() {
  const language = useLanguage();
  const t = labels[language];
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'failure'>('idle');
  const locked = useRef(false);
  const submissionId = useRef<string | undefined>(undefined);
  const set = (key: keyof typeof empty, value: string | boolean) => { setForm(current => ({ ...current, [key]: value })); setErrors(current => ({ ...current, [key]: '' })); };
  const fields = ['name', 'email', 'organization', 'subject', 'message'] as const;
  const limits = { name: 120, email: 254, organization: 160, subject: 200, message: 5000 };
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current) return;
    submissionId.current ??= crypto.randomUUID();
    const result = contactSchema.safeParse({ ...form, submissionId: submissionId.current });
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = String(issue.path[0]);
        next[field] = field === 'consent' ? 'consentError' : issue.code === 'too_big' ? 'long' : field === 'email' ? 'invalidEmail' : issue.code === 'too_small' ? 'required' : 'invalid';
      }
      setErrors(next);
      document.getElementById(`contact-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    locked.current = true;
    setState('sending');
    try {
      const response = await fetch('/api/public/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result.data) });
      const body = await response.json() as { ok?: boolean };
      if (!response.ok || !body.ok) throw new Error('send failed');
      setForm(empty); setErrors({}); submissionId.current = undefined; setState('success');
    } catch { setState('failure'); }
    finally { locked.current = false; }
  }
  const error = (key: string) => errors[key] ? <p id={`contact-${key}-error`} className="mt-2 text-sm text-destructive">{t[errors[key] as keyof typeof t]}</p> : null;
  return <form onSubmit={submit} noValidate className="space-y-6">
    <fieldset disabled={state === 'sending'} className="grid min-w-0 gap-6 sm:grid-cols-2">
      {fields.map(key => <div key={key} className={key === 'subject' || key === 'message' ? 'sm:col-span-2' : ''}>
        <label htmlFor={`contact-${key}`} className="mb-2 block text-sm font-medium">{t[key]} {key === 'organization' ? <span className="font-normal text-muted-foreground">({t.optional})</span> : <span aria-hidden="true">*</span>}</label>
        {key === 'message' ? <Textarea id={`contact-${key}`} required rows={7} maxLength={limits[key]} value={form[key]} onChange={event => set(key, event.target.value)} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `contact-${key}-error` : undefined} /> : <Input id={`contact-${key}`} type={key === 'email' ? 'email' : 'text'} autoComplete={key === 'name' ? 'name' : key === 'email' ? 'email' : key === 'organization' ? 'organization' : 'off'} required={key !== 'organization'} maxLength={limits[key]} value={form[key]} onChange={event => set(key, event.target.value)} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `contact-${key}-error` : undefined} />}
        {error(key)}
      </div>)}
      <div className="sm:col-span-2">
        <label htmlFor="contact-reason" className="mb-2 block text-sm font-medium">{t.reason} <span className="font-normal text-muted-foreground">({t.optional})</span></label>
        <Select value={form.reason || 'none'} onValueChange={value => set('reason', value === 'none' ? '' : value)}>
          <SelectTrigger id="contact-reason"><SelectValue placeholder={t.select} /></SelectTrigger>
          <SelectContent><SelectItem value="none">{t.select}</SelectItem>{contactReasons.map((reason, index) => <SelectItem key={reason} value={reason}>{reasons[language][index]}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div hidden aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={event => set('website', event.target.value)} /></div>
      <div className="sm:col-span-2">
        <div className="flex items-start gap-3"><Checkbox id="contact-consent" checked={form.consent} onCheckedChange={value => set('consent', value === true)} aria-invalid={Boolean(errors['consent'])} aria-describedby={errors['consent'] ? 'contact-consent-error' : undefined} className="mt-1" /><label htmlFor="contact-consent" className="text-sm leading-relaxed">{t.consent} *</label></div>
        {error('consent')}
      </div>
    </fieldset>
    <p className="text-xs leading-relaxed text-muted-foreground">{t.privacy}</p>
    <Button type="submit" size="lg" disabled={state === 'sending'}>{state === 'sending' ? <LoaderCircle className="animate-spin" /> : <Send />}{state === 'sending' ? t.sending : t.send}</Button>
    {state === 'success' && <p role="status" className="text-sm text-primary">{t.success}</p>}
    {state === 'failure' && <p role="alert" className="text-sm text-destructive">{t.failure}</p>}
  </form>;
}