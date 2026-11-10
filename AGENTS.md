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
- Consolidate language/query views into each clean route canonical and sitemap URL; retain URL-based language selection but omit hreflang for noncanonical parameter views to avoid conflicting indexing signals.
- Keep hardness conversion equations and domain checks in a pure browser-safe module; invert only inside documented brackets so empirical relationships cannot silently extrapolate.
- Keep roughness comparisons in a pure browser-safe module with model-specific Ra/Rq bounds and explicit unavailable Rz/Rt outputs; unit changes preserve the physical input and never invent process multipliers.

- Keep friction calculations in a pure browser-safe module with nonnegative magnitudes, divisor validation and degree/radian boundaries; distinguish incline static estimates from measured kinetic friction.
