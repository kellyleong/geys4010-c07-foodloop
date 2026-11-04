# 食得「伍」浪費

Static HTML, CSS and JavaScript published at https://kellyleong.github.io/geys4010-c07-foodloop/.

The `#live-data` chapter sits between the O·PARK introduction and the food waste conversion journey. Official source links, reference periods and source screenshots are included in that chapter.

`scripts/update-food-waste.py` reads annual food waste recovery from C&SD table 950-92053 and collection-point counts from the EPD recycling schemes page. It writes `data/official-food-waste.json`. The API reports whole thousand tonnes; it is annual data, not a real-time measurement. Other figures in `index.html` are dated editorial records and need source review before updates.

`.github/workflows/publish.yml` refreshes those two sources and deploys the static site on pushes to `main`, manual runs and a daily schedule at 06:17 Hong Kong time. Scheduled starts may be delayed by GitHub. Generated deployment data does not create extra source commits. A failed source refresh stops that deployment and leaves the previously published site available.

For a local preview, run `python3 -m http.server` from the repository. No dependency installation or build is required.
