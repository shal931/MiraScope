const { execFileSync } = require('child_process');

const port = Number(process.argv[2] || process.env.PORT || 5000);

function getListeningPidsOnWindows(targetPort) {
  const output = execFileSync('cmd.exe', ['/c', `netstat -ano -p tcp | findstr :${targetPort}`], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });

  const pids = new Set();
  for (const line of output.split(/\r?\n/)) {
    if (!/LISTENING/i.test(line)) continue;
    const match = line.trim().match(/LISTENING\s+(\d+)$/i);
    if (match) {
      pids.add(Number(match[1]));
    }
  }

  return [...pids];
}

function getImageNameForPid(pid) {
  const output = execFileSync('tasklist.exe', ['/FI', `PID eq ${pid}`, '/FO', 'CSV', '/NH'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });

  const firstLine = output.split(/\r?\n/).find(Boolean) || '';
  const match = firstLine.match(/^"([^"]+)"/);
  return match ? match[1].toLowerCase() : '';
}

function stopPid(pid) {
  execFileSync('taskkill.exe', ['/PID', String(pid), '/F'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
}

if (process.platform !== 'win32') {
  process.exit(0);
}

try {
  const listeningPids = getListeningPidsOnWindows(port);

  for (const pid of listeningPids) {
    try {
      const imageName = getImageNameForPid(pid);

      if (imageName === 'node.exe' || imageName === 'nodemon.exe') {
        stopPid(pid);
        console.log(`Stopped stale server process on port ${port} (PID ${pid}).`);
      }
    } catch (err) {
      console.warn(`Skipping PID ${pid} on port ${port}: could not inspect or stop it.`);
    }
  }
} catch (err) {
  // No listener found or the lookup command failed; let the normal startup proceed.
}
