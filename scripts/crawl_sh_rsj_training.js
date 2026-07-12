#!/usr/bin/env node

const fs = require("node:fs/promises");
const path = require("node:path");

const BASE_URL = "https://www.rsj.sh.gov.cn";
const PAGE_URL = `${BASE_URL}/zypx-out-shrs/0013/zypx/out/query/indexByPc`;
const LIST_URL = `${BASE_URL}/zypx-out-shrs/0013/zypx/out/query/pxjgcx/query`;
const DETAIL_URL = `${BASE_URL}/zypx-out-shrs/0013/zypx/out/query/pxjgcx/pxjgInfo`;

const DISTRICTS = {
  "市中心": "00",
  "黄浦": "01",
  "徐汇": "04",
  "长宁": "05",
  "静安": "06",
  "普陀": "07",
  "虹口": "09",
  "杨浦": "10",
  "闵行": "12",
  "崇明": "30",
  "宝山": "13",
  "奉贤": "26",
  "浦东": "15",
  "金山": "16",
  "松江": "17",
  "青浦": "18",
  "嘉定": "14",
  "直属部": "97",
};

const LEVELS = {
  "初级/五级": "9",
  "中级/四级": "7",
  "高级/三级": "5",
  "技师/二级": "3",
  "高级技师/一级": "1",
  "专项职业能力": "F",
};

const QUALITIES = {
  "A级": "1",
  "B级": "2",
  "C级": "3",
};

function parseArgs(argv) {
  const options = {
    outDir: "rsj_training_output",
    pageSize: 100,
    delayMs: 800,
    cooldownMs: 60000,
    includeDetails: true,
    filters: {},
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === "--out-dir") {
      options.outDir = next;
      i += 1;
    } else if (arg === "--page-size") {
      options.pageSize = Number(next);
      i += 1;
    } else if (arg === "--delay-ms") {
      options.delayMs = Number(next);
      i += 1;
    } else if (arg === "--cooldown-ms") {
      options.cooldownMs = Number(next);
      i += 1;
    } else if (arg === "--no-details") {
      options.includeDetails = false;
    } else if (arg === "--name") {
      options.filters.pxdwmc = next;
      i += 1;
    } else if (arg === "--project") {
      options.filters.pxxmmc = next;
      i += 1;
    } else if (arg === "--district") {
      options.filters.ssqx = DISTRICTS[next] || next;
      i += 1;
    } else if (arg === "--level") {
      options.filters.pxdj = LEVELS[next] || next;
      i += 1;
    } else if (arg === "--quality") {
      options.filters.pxjgcxzldj = QUALITIES[next] || next;
      i += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!Number.isFinite(options.pageSize) || options.pageSize < 1) {
    throw new Error("--page-size must be a positive number");
  }
  if (!Number.isFinite(options.delayMs) || options.delayMs < 0) {
    throw new Error("--delay-ms must be zero or a positive number");
  }
  if (!Number.isFinite(options.cooldownMs) || options.cooldownMs < 0) {
    throw new Error("--cooldown-ms must be zero or a positive number");
  }

  return options;
}

function printHelp() {
  console.log(`
Usage:
  node scripts/crawl_sh_rsj_training.js [options]

Options:
  --out-dir <dir>       Output directory. Default: rsj_training_output
  --page-size <n>       Page size for list requests. Default: 100
  --delay-ms <n>        Delay between requests. Default: 800
  --cooldown-ms <n>     Wait time after rate limiting. Default: 60000
  --no-details          Only crawl institution list, skip project details
  --name <text>         Filter by institution name
  --project <text>      Filter by training project name
  --district <name|id>  Filter by district, e.g. 浦东 or 15
  --level <name|id>     Filter by level, e.g. 高级/三级 or 5
  --quality <name|id>   Filter by quality, e.g. A级 or 1
`);
}

async function sleep(ms) {
  if (ms > 0) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}

async function fetchText(url, options = {}, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
          accept: "application/json,text/plain,*/*",
          ...options.headers,
        },
      });
      const text = await response.text();
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${text.slice(0, 300)}`);
      }
      return text;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await sleep(500 * attempt);
      }
    }
  }
  throw lastError;
}

async function postJson(url, data, attempts = 6) {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null && value !== "") {
      body.set(key, String(value));
    }
  }

  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const text = await fetchText(url, {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "x-requested-with": "XMLHttpRequest",
          referer: PAGE_URL,
        },
        body,
      });
      const json = JSON.parse(text);
      if (json.status && Number(json.status) >= 300) {
        throw new Error(json.message || `Business status ${json.status}`);
      }
      return json;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        const waitMs = 1000 * attempt;
        console.warn(`Request failed (${error.message}); retrying in ${waitMs}ms...`);
        await sleep(waitMs);
      }
    }
  }
  throw lastError;
}

async function getUd() {
  const html = await fetchText(PAGE_URL);
  const match = html.match(/name=["']ud["'][^>]*value=["']([^"']+)["']/i);
  if (!match) {
    throw new Error("Could not find ud token on the query page");
  }
  return match[1];
}

async function crawlList(ud, options) {
  const firstPage = await postJson(LIST_URL, {
    ...options.filters,
    ud,
    pageIndex: 0,
    pageSize: options.pageSize,
    sortField: "",
    sortOrder: "",
  });

  const total = Number(firstPage.total || firstPage.summary?.total || firstPage.data?.length || 0);
  const all = [...(firstPage.data || [])];
  const pageCount = Math.ceil(total / options.pageSize);

  console.log(`List total: ${total}`);
  console.log(`Fetched page 1/${pageCount}`);

  for (let pageIndex = 1; pageIndex < pageCount; pageIndex += 1) {
    await sleep(options.delayMs);
    const page = await postJson(LIST_URL, {
      ...options.filters,
      ud,
      pageIndex,
      pageSize: options.pageSize,
      sortField: "",
      sortOrder: "",
    });
    const rows = page.data || [];
    if (rows.length === 0 && pageIndex + 1 < pageCount) {
      throw new Error(`Page ${pageIndex + 1} returned no rows before the last page`);
    }
    all.push(...rows);
    console.log(`Fetched page ${pageIndex + 1}/${pageCount}`);
  }

  return all;
}

function isRateLimitError(error) {
  return /频繁|稍后再试|rate/i.test(error.message || "");
}

async function crawlDetails(ud, institutions, options) {
  for (let i = 0; i < institutions.length; i += 1) {
    const row = institutions[i];
    if (row.projects) {
      console.log(`Skipped existing details ${i + 1}/${institutions.length}: ${row.pxdwmc}`);
      continue;
    }

    for (;;) {
      try {
        await sleep(options.delayMs);
        const detail = await postJson(DETAIL_URL, {
          cid: row.cid,
          ud,
        });
        row.projects = detail.result?.data || detail.data || [];
        console.log(`Fetched details ${i + 1}/${institutions.length}: ${row.pxdwmc}`);
        await fs.mkdir(options.outDir, { recursive: true });
        await fs.writeFile(
          path.join(options.outDir, "institutions_with_projects.partial.json"),
          JSON.stringify(institutions, null, 2),
          "utf8",
        );
        break;
      } catch (error) {
        if (!isRateLimitError(error)) {
          throw error;
        }
        console.warn(
          `Rate limited while fetching ${row.pxdwmc}; cooling down for ${options.cooldownMs}ms...`,
        );
        await sleep(options.cooldownMs);
      }
    }
  }
}

async function mergePartialDetails(outDir, institutions) {
  const partialPath = path.join(outDir, "institutions_with_projects.partial.json");
  try {
    const partial = JSON.parse(await fs.readFile(partialPath, "utf8"));
    const projectsByCid = new Map();
    for (const row of partial) {
      if (row.cid && Array.isArray(row.projects)) {
        projectsByCid.set(row.cid, row.projects);
      }
    }
    let restored = 0;
    for (const row of institutions) {
      if (projectsByCid.has(row.cid)) {
        row.projects = projectsByCid.get(row.cid);
        restored += 1;
      }
    }
    if (restored > 0) {
      console.log(`Restored ${restored} detail records from partial output.`);
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

function csvCell(value) {
  if (value === undefined || value === null) {
    return "";
  }
  const text = String(value);
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toCsv(rows, headers) {
  return [
    headers.map((header) => csvCell(header.label)).join(","),
    ...rows.map((row) => headers.map((header) => csvCell(row[header.key])).join(",")),
  ].join("\r\n");
}

async function writeOutputs(outDir, institutions) {
  await fs.mkdir(outDir, { recursive: true });

  const jsonPath = path.join(outDir, "institutions_with_projects.json");
  await fs.writeFile(jsonPath, JSON.stringify(institutions, null, 2), "utf8");

  const institutionRows = institutions.map((row) => ({
    pxdwmc: row.pxdwmc,
    qxName: row.qxName,
    pxdwdz: row.pxdwdz,
    pxdwlxdh: row.pxdwlxdh,
    zzdjName: row.zzdjName,
    cid: row.cid,
    projectCount: row.projects ? row.projects.length : "",
  }));

  const institutionCsvPath = path.join(outDir, "institutions.csv");
  await fs.writeFile(
    institutionCsvPath,
    "\ufeff" +
      toCsv(institutionRows, [
        { key: "pxdwmc", label: "培训机构名称" },
        { key: "qxName", label: "所属区" },
        { key: "pxdwdz", label: "联系地址" },
        { key: "pxdwlxdh", label: "联系电话" },
        { key: "zzdjName", label: "办学质量和诚信等级" },
        { key: "cid", label: "机构ID" },
        { key: "projectCount", label: "项目数量" },
      ]),
    "utf8",
  );

  const projectRows = [];
  for (const institution of institutions) {
    for (const project of institution.projects || []) {
      projectRows.push({
        cid: institution.cid,
        pxdwmc: institution.pxdwmc,
        qxName: institution.qxName,
        xmmc: project.xmmc,
        zydjName: project.zydjName,
      });
    }
  }

  const projectCsvPath = path.join(outDir, "projects.csv");
  await fs.writeFile(
    projectCsvPath,
    "\ufeff" +
      toCsv(projectRows, [
        { key: "cid", label: "机构ID" },
        { key: "pxdwmc", label: "培训机构名称" },
        { key: "qxName", label: "所属区" },
        { key: "xmmc", label: "培训项目名称" },
        { key: "zydjName", label: "培训等级" },
      ]),
    "utf8",
  );

  return { jsonPath, institutionCsvPath, projectCsvPath };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  console.log("Fetching query token...");
  const ud = await getUd();
  console.log("Fetching institution list...");
  const institutions = await crawlList(ud, options);

  if (options.includeDetails) {
    await mergePartialDetails(options.outDir, institutions);
    console.log("Fetching project details...");
    await crawlDetails(ud, institutions, options);
  }

  const outputs = await writeOutputs(options.outDir, institutions);
  console.log("Done.");
  console.log(`JSON: ${outputs.jsonPath}`);
  console.log(`Institutions CSV: ${outputs.institutionCsvPath}`);
  console.log(`Projects CSV: ${outputs.projectCsvPath}`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
