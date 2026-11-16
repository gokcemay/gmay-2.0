import { useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Box, Check, CheckCheck, ChevronRight, FileBox, GitCompareArrows, History, Mail, ShieldCheck, SlidersHorizontal, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/site/LanguageSelector';
import { useLanguage } from '@/lib/i18n';
import interfaceImage from '@/assets/ai-step-interface.jpg.asset.json';
import bracketImage from '@/assets/ai-step-bracket.jpg.asset.json';

const copy = {
  en: {
    concept: 'PRE-PRODUCT CONCEPT', pilot: 'Discuss a pilot', eyebrow: 'A NEW WORKFLOW FOR MANUFACTURING', subtitle: 'Upload your STEP file.\nDescribe the revision.', intro: 'A concept for an AI-assisted engineering workspace that aims to revise existing CAD geometry using natural language.', explore: 'Explore the workflow', note: 'Illustrative interface. Not a screenshot of a working product.', next: 'FROM REQUEST TO REVISED PART', nextTitle: 'Less revision traffic.\nMore control.', nextIntro: 'For manufacturing teams handling small, recurring changes to customer STEP files: holes, slots, chamfers and dimensions.', pains: ['Reopening the CAD file', 'Keeping track of revisions', 'Checking before delivery'], painText: ['Even a small change needs CAD software, the right person and a new file.', 'Requests live in messages. The file version and scope of change can become hard to follow.', 'The team must check that only the requested geometry changed before handing over the new STEP.'], workflow: 'THE PLANNED EXPERIENCE', workflowTitle: 'One request. A controlled workflow.', steps: ['Upload', 'Describe', 'Review', 'Export'], stepText: ['Start from an existing STEP file. Preserve the source geometry as a separate original.', 'Select a face or hole if needed, then describe the revision in your own words.', 'Compare versions and check dimensions, geometry validity and preserved features.', 'Approve the revision as an engineer, then export a new STEP version.'], stageLabel: 'PLANNED STEP', scenarios: 'FIRST-VERSION FOCUS', scenarioTitle: 'Small changes.\nReal engineering work.', scenarioIntro: 'Simple prismatic parts and controlled geometry operations are the intended starting point.', scenarioNames: ['Flanges & plates', 'Machined parts', 'Fixtures & tooling'], scenarioText: ['Center holes, mounting holes, outer contours and thickness revisions.', 'Slots, pockets, new holes and local geometry changes.', 'Mounting points and part variants for fixtures and tooling.'], requests: ['“Increase the center hole from Ø10 mm to Ø12 mm. Preserve the four mounting holes.”', '“Cut a 10 × 30 mm slot into the front face.”', '“Add two M8 mounting holes to the base.”'], preview: 'ILLUSTRATIVE REVISION', before: 'Original', after: 'Target revision', dimension: 'Center hole', preserved: '4 mounting holes preserved', demoNote: 'Schematic concept preview only. No STEP file is uploaded, edited or generated here.', checks: 'ENGINEERING CONTROL', checksTitle: 'Automation helps.\nThe engineer decides.', checksIntro: 'The goal is not just new geometry, but a revision that remains traceable and reviewable.', checkNames: ['Preserve the original', 'Track the change', 'Validate the geometry', 'Require engineer approval'], checkText: ['Create a new version without overwriting the source STEP.', 'Keep the instruction, file version and operations together.', 'Check solid-model validity, dimensions and selected features.', 'Review the comparison before exporting the revised file.'], technical: 'A note about STEP', technicalText: 'STEP files generally do not include parametric history. Not every change can be made directly; complex geometry may require remodeling and engineering review.', pilotLabel: 'EARLY-STAGE PILOT', pilotTitle: 'Let’s start with\nyour real parts.', pilotIntro: 'We are looking for pilot companies to understand their CAD revision workload and shape the concept around real use cases.', audience: 'Small and medium manufacturers · CNC / subcontract machining · Machine builders · Teams with frequent STEP revisions', pilotSteps: ['Your workflow', 'Sample files', 'Success criteria'], pilotText: ['A short conversation about your revision types and current process.', '2–3 STEP files you have permission to share, with change requests.', 'Evaluate accuracy, time and human intervention together.'], email: 'Contact for a pilot', disclaimer: 'This is a pre-product concept introduction, not a commitment to existing functionality or services.', footer: 'Engineering × AI × Research', subject: 'AI STEP Editor — pilot discussion',
  },
  tr: {
    concept: 'ÜRÜN ÖNCESİ KONSEPT', pilot: 'Pilot görüşmesi', eyebrow: 'İMALAT İÇİN YENİ BİR İŞ AKIŞI', subtitle: 'STEP dosyanızı yükleyin.\nRevizyonu tarif edin.', intro: 'Mevcut CAD geometrisi üzerinde doğal dille revizyon yapılmasını hedefleyen yapay zekâ destekli bir mühendislik çalışma alanı konsepti.', explore: 'İş akışını keşfet', note: 'Temsili arayüz. Çalışan bir ürünün ekran görüntüsü değildir.', next: 'TALEPTEN REVİZE PARÇAYA', nextTitle: 'Daha az revizyon trafiği.\nDaha fazla kontrol.', nextIntro: 'Müşteriden gelen STEP dosyalarında küçük, tekrar eden delik, kanal, pah ve ölçü değişiklikleri yapan imalat ekipleri için.', pains: ['CAD dosyasını yeniden açma', 'Revizyonları takip etme', 'Teslim öncesi kontrol'], painText: ['Küçük bir değişiklik bile CAD yazılımına, uygun personele ve yeni dosya hazırlığına ihtiyaç duyuyor.', 'Talepler mesajlarda kalıyor. Dosya sürümünü ve değişikliğin kapsamını izlemek zorlaşıyor.', 'Yeni STEP teslim edilmeden önce yalnızca istenen geometrinin değiştiğinden emin olmak gerekiyor.'], workflow: 'PLANLANAN DENEYİM', workflowTitle: 'Tek bir talep. Kontrollü bir iş akışı.', steps: ['Yükle', 'Tarif et', 'Kontrol et', 'İndir'], stepText: ['Mevcut STEP dosyasıyla başlayın. Kaynak geometriyi ayrı bir orijinal olarak koruyun.', 'Gerekirse yüzeyi veya deliği seçin; revizyonu kendi cümlelerinizle tarif edin.', 'Sürümleri karşılaştırın; ölçüleri, geometri geçerliliğini ve korunan özellikleri kontrol edin.', 'Revizyonu mühendis olarak onaylayın, ardından yeni bir STEP sürümünü dışa aktarın.'], stageLabel: 'PLANLANAN ADIM', scenarios: 'İLK SÜRÜMÜN ODAĞI', scenarioTitle: 'Küçük değişiklikler.\nGerçek mühendislik işleri.', scenarioIntro: 'Basit prizmatik parçalar ve kontrollü geometri işlemleri hedeflenen başlangıç noktasıdır.', scenarioNames: ['Flanş ve plakalar', 'İşlenmiş makine parçaları', 'Fikstür ve aparatlar'], scenarioText: ['Merkez delik, bağlantı deliği, dış kontur ve kalınlık revizyonları.', 'Kanal, cep, yeni delik ve lokal geometri değişiklikleri.', 'Fikstür ve aparatlar için bağlantı noktaları ve parça varyantları.'], requests: ['“Merkez deliğini Ø10 mm’den Ø12 mm’ye çıkar. Dört bağlantı deliğini koru.”', '“Ön yüzde 10 × 30 mm boyutlarında kanal aç.”', '“Tabana iki adet M8 bağlantı deliği ekle.”'], preview: 'TEMSİLİ REVİZYON', before: 'Orijinal', after: 'Hedef revizyon', dimension: 'Merkez delik', preserved: '4 bağlantı deliği korunuyor', demoNote: 'Yalnızca şematik konsept gösterimi. Burada STEP dosyası yüklenmez, düzenlenmez veya üretilmez.', checks: 'MÜHENDİSLİK KONTROLÜ', checksTitle: 'Otomasyon hızlandırır.\nSon kararı mühendis verir.', checksIntro: 'Hedef yalnızca yeni geometri değil; izlenebilir ve kontrol edilebilir bir revizyon.', checkNames: ['Orijinali koruma', 'Değişiklik geçmişi', 'Geometrik doğrulama', 'Mühendis onayı'], checkText: ['Kaynak STEP dosyasını değiştirmeden yeni sürüm oluşturma.', 'Revizyon talimatını, dosya sürümünü ve işlemleri birlikte tutma.', 'Katı model geçerliliğini, ölçüleri ve seçili özellikleri denetleme.', 'Revize dosyayı dışa aktarmadan önce karşılaştırmayı inceleme.'], technical: 'STEP hakkında teknik not', technicalText: 'STEP dosyaları genellikle parametrik geçmiş içermez. Her değişiklik doğrudan yapılamayabilir; karmaşık geometri için yeniden modelleme ve mühendis kontrolü gerekebilir.', pilotLabel: 'ERKEN AŞAMA PİLOT', pilotTitle: 'Gerçek parçalarınızla\nbirlikte başlayalım.', pilotIntro: 'CAD revizyon yükünüzü anlamak ve konsepti gerçek kullanım senaryolarınızla şekillendirmek için pilot firma arıyoruz.', audience: 'Küçük ve orta ölçekli imalat firmaları · CNC / fason işleme · Makine üreticileri · Sık STEP revizyonu yapan ekipler', pilotSteps: ['İş akışınız', 'Örnek dosyalar', 'Başarı ölçütleri'], pilotText: ['Revizyon türlerinizi ve mevcut sürecinizi kısa bir görüşmeyle tanıyalım.', 'Paylaşım izni olan 2–3 STEP dosyası ve değişiklik talebi.', 'Doğruluk, süre ve insan müdahalesini birlikte değerlendirelim.'], email: 'Pilot için iletişime geçin', disclaimer: 'Bu sayfa ürün öncesi konsept tanıtımıdır; mevcut işlev veya hizmet taahhüdü değildir.', footer: 'Mühendislik × Yapay Zekâ × Araştırma', subject: 'AI STEP Editor — pilot görüşmesi',
  },
};

function PartPreview({ scenario, revised, label }: { scenario: number; revised: boolean; label: string }) {
  return <svg viewBox="0 0 520 320" className="step-part" role="img" aria-label={label}>
    <defs><pattern id="step-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--border)" strokeWidth="0.7" /></pattern></defs>
    <rect width="520" height="320" fill="url(#step-grid)" />
    <g transform="translate(260 155)">
      <path d="M-150-73 H150 V87 L132 102 H-168 V-58Z" fill="var(--step-metal-side)" stroke="var(--step-line)" strokeWidth="1.5" />
      <rect x="-168" y="-88" width="300" height="175" rx="14" fill="var(--step-metal)" stroke="var(--step-line)" strokeWidth="1.5" />
      {[[-138,-58],[102,-58],[-138,57],[102,57]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="10" fill="var(--background)" stroke="var(--step-line)" strokeWidth="2" />)}
      {scenario === 0 && <><circle cx="-18" cy="0" r={revised ? 42 : 35} className="step-hole" /><path d="M-18-52 V52 M-70 0 H34" stroke="var(--step-line)" strokeDasharray="5 5" /><path d="M25-18 90-110H150" fill="none" stroke="var(--primary)" /><text x="95" y="-118" fill="var(--primary)" fontSize="15" fontFamily="monospace">Ø{revised ? '12' : '10'} mm</text></>}
      {scenario === 1 && revised && <rect x="-70" y="-24" width="104" height="38" rx="9" className="step-hole" />}
      {scenario === 2 && revised && <>{[-58,22].map(x => <g key={x}><circle cx={x} cy="0" r="13" className="step-hole" /><circle cx={x} cy="0" r="17" fill="none" stroke="var(--primary)" strokeDasharray="3 3" /></g>)}<text x="-38" y="-40" fill="var(--primary)" fontSize="15" fontFamily="monospace">2 × M8</text></>}
    </g>
  </svg>;
}

export default function AiStepLanding() {
  const language = useLanguage();
  const c = copy[language];
  const [stage, setStage] = useState(0);
  const [scenario, setScenario] = useState(0);
  const [revised, setRevised] = useState(true);
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  const mail = `mailto:gmehmetay@gmail.com?subject=${encodeURIComponent(c.subject)}`;
  const icons = [Upload, SlidersHorizontal, GitCompareArrows, FileBox];
  const controlIcons = [ShieldCheck, History, CheckCheck, Check];
  return <div className="step-page">
    <header className="step-header"><div className="step-wrap flex items-center justify-between gap-3">
      <a href="#top" aria-label="AI STEP Editor" className="step-brand"><Box size={26} strokeWidth={1.6} /><span>AI STEP<span className="font-normal"> EDITOR</span></span></a>
      <div className="flex items-center gap-3"><LanguageSelector /><Button className="hidden sm:inline-flex" size="sm" onClick={() => scrollTo('pilot')}>{c.pilot}<ArrowUpRight /></Button></div>
    </div></header>

    <main>
      <section id="top" className="step-hero">
        <div className="step-wrap step-hero-copy"><span className="step-eyebrow"><span className="step-status-dot" />{c.eyebrow}</span>
          <h1>AI STEP <span>EDITOR</span></h1>
          <h2>{c.subtitle}</h2><p>{c.intro}</p>
          <div className="flex flex-wrap justify-center gap-3"><Button size="lg" onClick={() => scrollTo('workflow')}>{c.explore}<ArrowDown /></Button><Button size="lg" variant="outline" onClick={() => scrollTo('pilot')}>{c.pilot}<ArrowUpRight /></Button></div>
        </div>
        <div className="step-hero-media step-wrap"><div className="step-image-bar"><span className="font-mono">AI STEP / WORKSPACE</span><span className="step-concept">{c.concept}</span></div><img src={interfaceImage.url} alt={language === 'tr' ? 'AI STEP Editor temsili arayüzü: flanş, revizyon isteği ve sürüm karşılaştırması' : 'AI STEP Editor illustrative interface with flange, revision request and version comparison'} fetchPriority="high" /><p>{c.note}</p></div>
      </section>

      <section className="step-section step-wrap"><div className="step-section-heading"><span className="step-eyebrow">01 / {c.next}</span><h2>{c.nextTitle}</h2><p>{c.nextIntro}</p></div>
        <div className="step-three">{c.pains.map((title,i) => <article className="step-pain" key={title}><span className="step-number">0{i+1}</span><h3>{title}</h3><p>{c.painText[i]}</p></article>)}</div>
      </section>

      <section id="workflow" className="step-section step-workflow"><div className="step-wrap"><div className="step-section-heading"><span className="step-eyebrow">02 / {c.workflow}</span><h2>{c.workflowTitle}</h2></div>
        <div className="step-stages" role="tablist" aria-label={c.workflow}>{c.steps.map((title,i) => { const Icon = icons[i] ?? Upload; return <Button id={`step-tab-${i}`} key={title} variant="ghost" role="tab" aria-selected={stage===i} aria-controls="step-stage-panel" onClick={() => setStage(i)} className={`step-stage ${stage===i ? 'step-active' : ''}`}><span className="step-stage-icon"><Icon /></span><span className="flex flex-col items-start gap-1"><span className="font-mono text-xs">0{i+1}</span><span>{title}</span></span><ChevronRight className="ml-auto" /></Button>; })}</div>
        <div id="step-stage-panel" role="tabpanel" aria-labelledby={`step-tab-${stage}`} className="step-workspace">
          <div className="step-workspace-caption"><span className="step-eyebrow">{c.stageLabel} / 0{stage+1}</span><h3>{c.steps[stage]}</h3><p aria-live="polite">{c.stepText[stage]}</p><span className="step-concept">{c.concept}</span></div>
          <img src={stage < 2 ? interfaceImage.url : bracketImage.url} loading="lazy" alt={c.note} />
        </div>
        <p className="step-small mt-4">{c.note}</p>
      </div></section>

      <section id="scenarios" className="step-section step-wrap"><div className="step-section-heading"><span className="step-eyebrow">03 / {c.scenarios}</span><h2>{c.scenarioTitle}</h2><p>{c.scenarioIntro}</p></div>
        <div className="step-scenario-layout"><div className="step-scenario-list" role="tablist" aria-label={c.scenarios}>{c.scenarioNames.map((title,i) => <Button key={title} role="tab" id={`scenario-tab-${i}`} aria-selected={scenario===i} aria-controls="step-scenario-panel" variant="ghost" onClick={() => { setScenario(i); setRevised(true); }} className={`step-scenario ${scenario===i ? 'step-active' : ''}`}><span className="step-number">0{i+1}</span><span><strong>{title}</strong><span>{c.scenarioText[i]}</span></span><ArrowUpRight /></Button>)}</div>
          <div id="step-scenario-panel" role="tabpanel" aria-labelledby={`scenario-tab-${scenario}`} className="step-demo"><div className="step-demo-top"><span className="step-eyebrow">{c.preview}</span><div className="flex gap-1" role="group" aria-label={language === 'tr' ? 'Revizyon karşılaştırması' : 'Revision comparison'}><Button size="sm" variant={revised ? 'ghost' : 'secondary'} aria-pressed={!revised} onClick={() => setRevised(false)}>{c.before}</Button><Button size="sm" variant={revised ? 'secondary' : 'ghost'} aria-pressed={revised} onClick={() => setRevised(true)}>{c.after}</Button></div></div>
            <PartPreview scenario={scenario} revised={revised} label={`${c.scenarioNames[scenario]} — ${revised ? c.after : c.before}`} />
            <blockquote aria-live="polite">{c.requests[scenario]}</blockquote><p className="step-small">{c.demoNote}</p>
          </div>
        </div>
      </section>

      <section className="step-section step-controls"><div className="step-wrap"><div className="step-section-heading"><span className="step-eyebrow">04 / {c.checks}</span><h2>{c.checksTitle}</h2><p>{c.checksIntro}</p></div>
        <div className="step-four">{c.checkNames.map((title,i) => { const Icon=controlIcons[i] ?? Check; return <article key={title}><Icon size={26} strokeWidth={1.5} /><h3>{title}</h3><p>{c.checkText[i]}</p></article>; })}</div>
        <aside className="step-technical"><span className="step-eyebrow">{c.technical}</span><p>{c.technicalText}</p></aside>
      </div></section>

      <section id="pilot" className="step-section step-pilot"><div className="step-wrap"><div className="step-pilot-layout"><div><span className="step-eyebrow">05 / {c.pilotLabel}</span><h2>{c.pilotTitle}</h2><p>{c.pilotIntro}</p><p className="step-audience">{c.audience}</p><Button size="lg" asChild><a href={mail}>{c.email}<ArrowUpRight /></a></Button><a className="step-mail" href={mail}><Mail size={15} />gmehmetay@gmail.com</a></div>
          <ol className="step-pilot-steps">{c.pilotSteps.map((title,i) => <li key={title}><span className="step-number">0{i+1}</span><div><h3>{title}</h3><p>{c.pilotText[i]}</p></div><ArrowRight size={18} /></li>)}</ol>
        </div><p className="step-disclaimer">{c.disclaimer}</p></div></section>
    </main>
    <footer className="step-footer step-wrap"><span className="step-brand"><Box size={20} />AI STEP EDITOR</span><span>Gökçe Mehmet Ay <span className="mx-2">/</span> {c.footer}</span><span className="font-mono">2026</span></footer>
  </div>;
}