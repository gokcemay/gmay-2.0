# Okur oylarını dışa aktarma

Ziyaretçilere açık bir yönetim sayfası veya CSV adresi oluşturulmadı. Böylece notlar yanlışlıkla herkese açılmaz ve ziyaretçi girişi eklenmez.

Proje sahibinin Lovable sohbetinden **“Teknik Resimden CAD'e oylarını ve yanlış notlarını CSV olarak dışa aktar”** demesi yeterlidir. Dışa aktarım proje sahibinin veritabanı erişimiyle, yalnızca aşağıdaki toplu sorgudan oluşturulmalı; hiçbir tarayıcıya ham oy satırları veya voter_id gönderilmemelidir.

```sql
SELECT figure_id,
       count(*) FILTER (WHERE vote = 1) AS doğru,
       count(*) FILTER (WHERE vote = -1) AS yanlış,
       string_agg(note, E'\n' ORDER BY updated_at)
         FILTER (WHERE vote = -1 AND note IS NOT NULL) AS notlar
FROM public.model_votes
GROUP BY figure_id
ORDER BY figure_id;
```

CSV dosyası istenince Lovable'ın özel dosya teslim alanına oluşturulur, public/ altına konmaz. Elektronik tablo formülü olarak yorumlanabilecek notlar CSV oluşturulurken metne dönüştürülmelidir.

Lovable Cloud panelinde `model_votes` yalnızca proje yetkililerine açıktır. `model_vote_export` aynı bilgileri toplu sunan, anonim ve ziyaretçi erişimi kapalı bir görünüm olarak da hazırdır. Panelde CSV dışa aktarma düğmesi bu oturumda doğrulanmadığı için önerilen doğrulanabilir yol sohbet üzerinden sorgudur.

Girişsiz oylama bir kişi doğrulama sistemi değildir. Kullanıcı kendi tarayıcı kimliğini görebilir veya değiştirebilir. Diğer okurların kimlikleri ve özel notları sunucudan okunamaz. Testler iki ayrı tarayıcının oylarının toplandığını, oyların değiştirilebildiğini/geri alınabildiğini ve 31. dakikalık çağrının reddedildiğini doğruladı.