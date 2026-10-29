# Academy study and practice

Open Basic School Subjects & Greek Mythology, choose a subject, then choose “Open study manual & hands-on workspace.” All nine subjects have a beginner manual, named tools, worked example, four-step procedure, interactive demonstration, three practical responses and a three-item skills check. The original twenty-question subject assessments remain intact; their default is untimed and their question page also displays the manual.

Practical writing uses explained model responses and a review checklist; it is not automatically assigned a grade. Skills checks are scored against explicit short-answer keys and retain explanations. Existing subject assessment grades continue to use the original report card and school progression. Skills check history is shown in each workshop and does not award duplicate story progression points.

Workshop drafts and submitted snapshots use a separate localStorage key, `wonderworld.academy-workshops.v1`. Export/restore merges workshop results and preserves existing drafts. Original classroom exports and imports retain their original format and key. Data stays in the same browser and origin; a move to a different domain requires exporting and importing both backups.

Original photographic assets, school-subject-data.js, Wendy’s story, navigation and existing questions are unchanged. This is an introductory workshop for each subject, not a complete school-year curriculum.

Validation:
- `node tests/neverland-grades.cjs`
- Install jsdom in your development environment, then `node tests/academy-workspace-dom.cjs` (or set JSDOM_PATH).
- With Playwright and Chromium installed, serve this directory on port 8765 and run `node tests/academy-workspace.cjs`. CHROME_PATH may select an installed Chrome executable.
