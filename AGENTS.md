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

- Photos load by folder via import.meta.glob in src/lib/photos.ts (cover in src/assets/cover, categories in src/assets/portfolio/<n-name>, sorted by filename); add/remove files to change the site without code edits.
- Gallery uses justified rows (src/lib/layout.ts) fed by aspect ratios from the `virtual:photo-sizes` Vite plugin (photo-sizes.plugin.ts) — photos keep original proportions with equal gaps, and adding files needs no code edits.
