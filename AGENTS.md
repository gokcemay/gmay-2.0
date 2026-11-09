<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Serve unlisted quiz reviews and language selectors as standalone HTML under public/r, outside the application layout, so uploaded scripts and content remain independent and receive no application analytics.
- Keep the CadQuery tool in the existing TanStack route system with an isolated layout and no analytics; keep prompt generation in a pure module so behavior can be tested without the UI.
- Resolve the site locale from root-validated URL search state and retain it across navigation; translate at presentation and prompt-template boundaries while keeping persisted choices, calculations, and public API values stable, so SSR and hydration agree.
- Keep the CAD gallery catalog/figure files at their original public URLs; use un-nested detail and legacy-link routes, a lazy Three.js viewer, locked vote tables and aggregate-only public RPCs to preserve links and private feedback.
- Keep separately translated English and Turkish pages self-canonical with reciprocal hreflang; centralize priority search copy and breadcrumb generation in the SEO helper to avoid conflicting tags without changing established URLs.
