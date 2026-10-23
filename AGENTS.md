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
