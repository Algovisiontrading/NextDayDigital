# NextDay Digital | Anthony & Luciano Alfano

MERGED CODE PACKAGE: both upload batches, including the previous Part 2 upgrades.

INSTALL: Copy into the existing website root and replace matching code files. Keep all existing images and both MP4 files. Do not delete the repository or media. Flat folder layout is retained.

BRANDING: Source copy now represents Anthony and Luciano together. Homepage structured data lists both founders. The existing anthonyalfano157@gmail.com address is unchanged; no mailbox was invented.

MENU AND WINE: Published CSV URLs are retained. Both loaders refresh every ten minutes while visible and check again when returning to the page. Home and full menu share the menu loader. Initial failures show unavailable states, not invented inventory; refresh failures retain the last successful in-memory results with a warning. Keep private information out of published sheets. ?staff=1 reveals workbook links for convenience, not authentication.

AGENCY FORM: Prepares an email, not a backend submission. Preview, copy fallback, and clear-draft controls are included. Drafts use sessionStorage and remain until cleared or the tab session ends. Old persistent drafts are removed on the next inquiry-page load. Opening an email app is not proof of delivery.

RESERVATIONS: Explicitly a demonstration. Required fields and past dates are validated, then a request preview is shown. No fictional inbox is contacted and no table is held.

VIDEO: Keep Restaurant-Home-Video.mp4 and Restaurant-Home-Video-Mobile.mp4 in the root. Muted playback, pause/play control, mobile fallback, reduced-motion handling, and hidden-tab pause are included. Browser autoplay restrictions still apply.

EFFECTS: theme-fx.css was absent from both uploads; a compatible stylesheet is reconstructed. It uses the supplied SVG tool cursors and a dark shadow only. Back up any newer deployed custom-fork-image integration before replacing effects files.

REMAINING PRODUCTION WORK:
- Test desktop and phone portrait/landscape, keyboard navigation, and live sheet loading on the deployed site.
- Connect a real form or booking provider for actual submissions and reservations.
- Keep approved photography. Repeated interior images presented as staff portraits were removed; other gallery images remain placeholders.
- Confirm canonical domain and sitemap before moving away from nextdaydigital.digital.
- 404.html retains relative paths; deeply nested missing URLs need a deployment-aware base path. No GitHub project base is guessed.
- Only the restaurant is a seven-page demo; the other seven retain their original single-page architecture.

See AUDIT-AND-VALIDATION.txt for testing boundaries.
