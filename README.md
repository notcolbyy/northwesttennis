# Northwest Tennis

Independent team website for Northwest High School tennis in Clarksville, Tennessee. The page shows the confirmed spring 2027 schedule for boys and girls, the four confirmed player profiles, and a placeholder for post-match recaps and the future fundraiser link. Start times and court locations have not been announced.

## Local development

Run `npm start` and open the local URL shown by the server. Run `npm test` for schedule, roster, and model checks.

The source page is `index.html` with `style.css`, `app.mjs`, `model.mjs`, `players.mjs`, `schedule.mjs`, and `assets/`. Run `node build-preview.mjs` to regenerate `Northwest-Tennis-Preview.html`, then `node build-public.mjs` to regenerate `public-deploy/index.html`. The public file embeds assets and has no preview editor.

The local editor is a browser-only prototype. It does not update the public website or provide secure admin access. The public site has no automated live scoring, donation link, or team store yet. Scores and recaps should only be published once confirmed after a match.

## Publishing

The `gh-pages` branch contains the contents of `public-deploy/`. GitHub Pages should be configured to publish from `gh-pages` at `/ (root)`. Rebuild and update that branch for future changes. The source remains on `main`.

This is an independent team website, not an official school publication.
