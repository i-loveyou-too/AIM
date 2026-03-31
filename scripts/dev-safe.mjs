import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const nodeBin = path.join(root, ".tooling", "node", "bin");
const npmPath = fs.existsSync(path.join(nodeBin, "npm")) ? path.join(nodeBin, "npm") : "npm";
const host = process.env.HOST ?? "127.0.0.1";
const candidatePorts = [3007, 3008, 3009, 3010, 4000, 4001, 4002, 4003];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clearNextBuildArtifacts() {
  const nextDir = path.join(root, ".next");

  if (!fs.existsSync(nextDir)) return;

  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log("Cleared stale .next artifacts before starting dev.");
}

function listenerPids(port) {
  try {
    // lsof 명령어가 있는지 확인하고 PID 추출
    const output = execFileSync("lsof", ["-tiTCP:" + port, "-sTCP:LISTEN"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();

    if (!output) return [];

    return output
      .split(/\s+/)
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));
  } catch {
    // lsof가 없거나 에러가 나면 빈 배열 반환
    return [];
  }
}

async function cleanupPort(port) {
  const pids = listenerPids(port);
  if (pids.length === 0) return;

  console.log(`Cleaning up existing processes on port ${port}...`);
  for (const pid of pids) {
    try {
      process.kill(pid, "SIGTERM");
    } catch {
      // 포트 정리 실패는 다음 단계에서 다시 판단합니다.
    }
  }

  await delay(800);

  for (const pid of listenerPids(port)) {
    try {
      process.kill(pid, "SIGKILL");
    } catch {
      // 같은 포트가 계속 남으면 다음 후보 포트로 넘깁니다.
    }
  }

  await delay(800);
}

clearNextBuildArtifacts();

async function startDev(port) {
  console.log(`Attempting dev server on port ${port}...`);

  const child = spawn(
    npmPath,
    ["run", "dev", "--", "--hostname", host, "--port", String(port)],
    {
      cwd: root,
      env: {
        ...process.env,
        PATH: `${nodeBin}:${process.env.PATH ?? ""}`,
      },
      stdio: "inherit",
    },
  );

  let listening = false;

  for (let attempt = 0; attempt < 12; attempt += 1) {
    await delay(250);
    if (listenerPids(port).length > 0) {
      listening = true;
      break;
    }
  }

  if (!listening) {
    try {
      child.kill("SIGTERM");
      await delay(400);
      if (listenerPids(port).length === 0) {
        child.kill("SIGKILL");
      }
    } catch {
      // 포트가 실제로 안 열렸으면 다음 후보로 넘어갑니다.
    }

    return false;
  }

  console.log(`Dev server is listening on ${host}:${port}.`);

  await new Promise((resolve) => {
    child.on("exit", () => resolve(null));
  });

  return true;
}

for (const port of candidatePorts) {
  await cleanupPort(port);

  if (listenerPids(port).length > 0) {
    continue;
  }

  const started = await startDev(port);

  if (started) {
    process.exit(0);
  }

  console.log(`Port ${port} failed, trying next one...`);
}

console.error("No free dev port could be started.");
process.exit(1);
