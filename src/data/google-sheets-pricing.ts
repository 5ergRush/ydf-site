import { pricingTiers } from "@/data/pricing";
import type {
  PricingAmount,
  PricingCurrency,
  PricingItem,
  PricingLoadResult,
} from "@/types/pricing";

const SPREADSHEET_ID = "16ZaBkmSW98BgsXhd528nZY4fI_1a-8uVfyp3QMITQw0";
const SHEET_NAME = "Pricelist";
const SHEET_RANGE = "A1:E17";
const CURRENCIES: PricingCurrency[] = ["AMD", "EURO", "RUBLY", "AED"];

const CURRENCY_PREFIX: Record<PricingCurrency, string> = {
  AMD: "֏",
  EURO: "€",
  RUBLY: "₽",
  AED: "AED ",
};

function buildGoogleSheetsCsvUrl() {
  const url = new URL(
    `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq`,
  );

  url.searchParams.set("tqx", "out:csv");
  url.searchParams.set("sheet", SHEET_NAME);
  url.searchParams.set("range", SHEET_RANGE);

  return url.toString();
}

function parseCsv(csv: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  const pushRow = () => {
    row.push(cell);
    rows.push(row);
    row = [];
    cell = "";
  };

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];

    if (quoted) {
      if (char === '"') {
        if (csv[index + 1] === '"') {
          cell += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        cell += char;
      }

      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      pushRow();
    } else if (char === "\r") {
      if (csv[index + 1] === "\n") {
        index += 1;
      }

      pushRow();
    } else {
      cell += char;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    pushRow();
  }

  return rows;
}

function formatPricingAmount(
  currency: PricingCurrency,
  value: string,
): PricingAmount {
  return {
    currency,
    value,
    display: `${CURRENCY_PREFIX[currency]}${value}`,
  };
}

function createPricingId(name: string, index: number) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return slug ? `${slug}-${index + 1}` : `pricing-row-${index + 1}`;
}

function mapRowsToPricingItems(rows: string[][]): PricingItem[] {
  return rows.slice(1).flatMap((row, index) => {
    const cells = Array.from({ length: 5 }, (_, cellIndex) =>
      (row[cellIndex] ?? "").trim(),
    );

    if (cells.every((cell) => cell.length === 0)) {
      return [];
    }

    const [name, ...amounts] = cells;

    if (!name) {
      return [];
    }

    const prices = amounts.flatMap((value, amountIndex) => {
      if (!value) {
        return [];
      }

      return [formatPricingAmount(CURRENCIES[amountIndex], value)];
    });

    return [
      {
        id: createPricingId(name, index),
        name,
        prices,
      },
    ];
  });
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown pricing fetch error";
}

export async function loadPricingFromGoogleSheet(): Promise<PricingLoadResult> {
  try {
    const response = await fetch(buildGoogleSheetsCsvUrl(), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Google Sheets responded with ${response.status}`);
    }

    const rows = parseCsv(await response.text());
    const items = mapRowsToPricingItems(rows);

    if (items.length === 0) {
      throw new Error("Google Sheets returned no pricing rows");
    }

    return {
      items,
      source: "google-sheet",
    };
  } catch (error) {
    return {
      items: pricingTiers,
      source: "fallback",
      error: getErrorMessage(error),
    };
  }
}
