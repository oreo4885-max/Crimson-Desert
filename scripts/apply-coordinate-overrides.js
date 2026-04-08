const fs = require("fs");
const path = require("path");
const vm = require("vm");

const cwd = process.cwd();

function resolveArg(flag, fallback) {
  const index = process.argv.indexOf(flag);
  if (index !== -1 && process.argv[index + 1]) {
    return path.resolve(cwd, process.argv[index + 1]);
  }
  return path.resolve(cwd, fallback);
}

const options = {
  input: resolveArg("--input", "data/verified-coordinate-overrides.json"),
  guide: resolveArg("--guide", "data/guideData.js"),
  output: resolveArg("--output", "data/guideData.js"),
  dryRun: process.argv.includes("--dry-run")
};

function formatNumber(value) {
  return Number(Number(value).toFixed(1));
}

function loadGuideData(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: filePath });

  if (!sandbox.window.guideData || !Array.isArray(sandbox.window.guideData.spots)) {
    throw new Error(`guideData를 읽지 못했습니다: ${filePath}`);
  }

  return sandbox.window.guideData;
}

function normalizeOverrideRecord(id, record, rawSpot) {
  if (!rawSpot || !record) return null;

  const coordinates = record.coordinates ?? record;
  const x = formatNumber(coordinates.x ?? rawSpot.coordinates.x);
  const y = formatNumber(coordinates.y ?? rawSpot.coordinates.y);

  return {
    id,
    name: record.name ?? rawSpot.name,
    coordinates: { x, y },
    mappingStatus: record.mappingStatus ?? record.mapping?.status ?? null,
    verifiedAt: record.verifiedAt ?? record.mapping?.verifiedAt ?? null
  };
}

function loadOverrides(filePath, guideData) {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (Array.isArray(raw.overrides)) {
    return raw.overrides
      .map((entry) => {
        const rawSpot = guideData.spots.find((spot) => spot.id === entry.id);
        return normalizeOverrideRecord(entry.id, entry, rawSpot);
      })
      .filter(Boolean);
  }

  return Object.entries(raw)
    .map(([id, record]) => {
      const rawSpot = guideData.spots.find((spot) => spot.id === id);
      return normalizeOverrideRecord(id, record, rawSpot);
    })
    .filter(Boolean);
}

function applyOverrides(guideData, overrides) {
  const updatedIds = [];

  for (const override of overrides) {
    const spot = guideData.spots.find((entry) => entry.id === override.id);
    if (!spot) continue;

    spot.coordinates = {
      x: override.coordinates.x,
      y: override.coordinates.y
    };

    spot.mapping = spot.mapping ?? {};

    if (override.mappingStatus) {
      spot.mapping.status = override.mappingStatus;
    }

    if (override.verifiedAt !== undefined) {
      spot.mapping.verifiedAt = override.verifiedAt;
    }

    updatedIds.push(override.id);
  }

  return updatedIds;
}

function serializeGuideData(guideData) {
  return `window.guideData = ${JSON.stringify(guideData, null, 2)};\n`;
}

function main() {
  const guideData = loadGuideData(options.guide);
  const overrides = loadOverrides(options.input, guideData);
  const updatedIds = applyOverrides(guideData, overrides);

  const summary = [
    `guide: ${options.guide}`,
    `input: ${options.input}`,
    `output: ${options.output}`,
    `updated: ${updatedIds.length}`
  ];

  if (updatedIds.length > 0) {
    summary.push(`ids: ${updatedIds.join(", ")}`);
  }

  if (options.dryRun) {
    console.log(summary.join("\n"));
    return;
  }

  fs.writeFileSync(options.output, serializeGuideData(guideData), "utf8");
  console.log(summary.join("\n"));
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
