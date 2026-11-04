"""Read the official annual series and current collection-point counts for Pages."""

import html
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen


ANNUAL_API = "https://www.censtatd.gov.hk/api/get.php?id=950-92053&lang=tc&param=N4KABGBEDGBukC4yghSBhA8gWUWA2uKmgA4CGJkANEcZCQDZkDO1tqkA7gPZvFoAzAKYAnEQH0AtgBcGffpAB244WKmz5dAOZNmrGvyjSh0gJZyDCkxNHdFmjgM4O0AT2eW63aQAtxIoWhuWFEhABNIdgBdIgBfS0hmeCQUDgAlbABlAHU8QkNINLJOcQBpcWlle2i4hJJRU24IlPZE6TIRaTxIACYABh6ARkiIeKJIU2aoAE4AVj6AWmn+2YBmeUgmRS1u6WhI2KA"
SCHEMES_PAGE = "https://www.wastereduction.gov.hk/zh-hk/waste-reduction-programme/food-waste-recycling-schemes"


def download(url):
    request = Request(url, headers={"User-Agent": "FoodLoop official public statistics"})
    with urlopen(request, timeout=45) as response:
        return response.read().decode("utf-8")


def main():
    annual = json.loads(download(ANNUAL_API))
    if annual["header"]["status"]["code"] != 0:
        raise ValueError(f"Official statistics query failed: {annual['header']['status']}")
    rows = sorted(
        [
            {"year": int(row["period"]), "thousand_tonnes": float(row["figure"])}
            for row in annual["dataSet"]
            if row["COM"] == "fw" and row["sv"] == "RMSW" and row["freq"] == "Y"
        ],
        key=lambda row: row["year"],
    )
    # The latest row is required to publish a usable annual series.
    print(f"Official annual series: {rows[-1]['year']}")
    text = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", download(SCHEMES_PAGE))))
    rcp = re.search(r"現時已於\s*([\d,]+)\s*個公眾垃圾收集站", text)
    spots = re.search(r"設立了\s*([\d,]+)\s*個「廚餘回收流動點」", text)
    if rcp is None or spots is None:
        raise ValueError("Could not locate the official collection-point counts on the schemes page")
    output = {
        "synchronized_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "annual_recovery": {
            "source_url": "https://www.censtatd.gov.hk/tc/web_table.html?id=950-92053",
            "api_url": ANNUAL_API,
            "scope": "全港都市固體廢物回收的廚餘；包括本地及香港以外循環再造",
            "unit": "千公噸，官方 API 以整數呈現",
            "frequency": "年度",
            "rows": rows,
        },
        "recycling_network": {
            "source_url": SCHEMES_PAGE,
            "statistics_date": None,
            "date_note": "原網頁未標示統計日期；synchronized_at 僅代表本次讀取時間",
            "frequency": "不定期更新",
            "refuse_collection_points": int(rcp.group(1).replace(",", "")),
            "recycling_spots": int(spots.group(1).replace(",", "")),
        },
    }
    target = Path(__file__).resolve().parents[1] / "data" / "official-food-waste.json"
    target.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Updated annual recovery and collection-point counts from official sources")


if __name__ == "__main__":
    main()
