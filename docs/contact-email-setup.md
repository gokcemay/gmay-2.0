# Contact form: setup and verification

Resend is connected. gmay.me was created in Resend (Ireland region), sending enabled, receiving disabled, tracking disabled. Domain verification is pending. The app cannot currently send from contact@gmay.me.

## DNS action required

Open https://resend.com/domains and select gmay.me. Add the following Resend-issued records in the DNS provider managing gmay.me. The authoritative nameservers currently resolve to dns1–dns4.p06.nsone.net. No authenticated DNS management connection is available in this project. Preserve existing website and mailbox records.

| Type | Name relative to gmay.me | Value | Priority | TTL |
|---|---|---|---|---|
| TXT | resend._domainkey | p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDF+VmLO/D7kTNuqB4B6lsg/lr1pBJLcKV6Kfxl3AjUpChJUc5md/1d3MPjSy3yK/aCtT2nUKb4BUpR95SGcDqkgRYBfaWc+gMHUyHOZL2R/Xd25KzUtpIaOuna2Lp6kc408q/I8m1PhZ4VqdFcu6WWW9EfOd4u4cv6cte7XdUxHQIDAQAB | — | Auto |
| MX | send | feedback-smtp.eu-west-1.amazonses.com | 10 | Auto |
| TXT | send | v=spf1 include:amazonses.com ~all | — | Auto |
| CNAME | rsend | send.forge.rmta.net | — | Auto |

These values came directly from Resend, not inferred DNS examples. No DMARC record was found. Consider a monitoring-only DMARC policy after reviewing the domain's other email senders; no DNS changes were made automatically.

## Configuration

- Server-only RESEND_API_KEY is held by the connected service; gateway authentication uses LOVABLE_API_KEY.
- CONTACT_EMAIL_TO optionally overrides the fixed default gmehmetay@gmail.com.
- CONTACT_EMAIL_FROM optionally overrides GMA Website <contact@gmay.me> without code changes. Only use an address allowed by the verified sending domain.
- App sends through the dedicated POST /api/public/contact handler; no Edge Function deployment is used on this stack.
- Each valid request sends one HTML/plain-text email, Reply-To set to validated visitor email, no visitor auto-reply.
- Messages are not stored in the app database. Resend processes message content and retains normal provider logs.

## Current report

| Item | Result |
|---|---|
| Contact page | Inactive notice replaced; visible email links retained; canonical/title/schema unchanged |
| Form fields | All requested fields, optional reason and unchecked required consent |
| Backend method | Dedicated same-origin POST handler, bounded JSON payload, server Zod validation |
| Email provider | Resend, connected; application credential path checked successfully |
| Recipient | gmehmetay@gmail.com |
| From address | GMA Website <contact@gmay.me>, configuration override supported |
| Reply-To | Visitor email; verified in outgoing payload unit test, not a received message |
| Spam protection | Hidden honeypot; strict validation; origin check; 32 KiB body limit; idempotency per submission; immediate client double-submit lock |
| Rate limiting | No robust platform IP limit available; 5/IP/15 min not implemented; no unreliable in-memory substitute |
| Data storage | No message database; provider processing and delivery logs remain |
| EN/TR | Client validation and safe send errors checked in both languages |
| Mobile test | 390px viewport checked; no horizontal overflow |
| Real email test | Real form submit attempted; provider rejected unverified sending domain; no delivery claimed |

21 automated tests pass. Preview build is healthy. Production-ready delivery is blocked by DNS verification, subsequent real-email test, received Reply-To verification and publication. Successful provider acceptance alone would not prove Gmail arrival. The five-per-IP policy is not enforced and remains an explicitly documented protection gap.

After DNS verifies, submit one English and one Turkish message through the real form, retrieve Resend email status and headers, and confirm receipt with the owner in Gmail. Check sender, reply address, subject, characters, and idempotent retry before marking delivery complete.