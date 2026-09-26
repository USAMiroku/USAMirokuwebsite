"""Refresh source mirror from committed files; never copy credentials or .git."""
import pathlib
import subprocess

root = pathlib.Path(__file__).resolve().parents[1]
if root.name != 'USAMirokuwebsite' or not str(root).startswith('/Volumes/'):
    raise SystemExit('Run from the USAMirokuwebsite checkout on the mounted T7 drive.')
mirror = root.parent / 'usa-mirokuwebsite-live' / 'src'
if not mirror.is_dir():
    raise SystemExit('Expected T7 mirror is missing; check the drive path.')
if subprocess.check_output(['git', 'status', '--porcelain'], cwd=root).strip():
    raise SystemExit('Commit or preserve local changes before mirroring.')
head = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root).decode().strip()
remote = subprocess.check_output(['git', 'ls-remote', 'origin', 'refs/heads/main'], cwd=root).decode().split()[0]
if head != remote:
    raise SystemExit('T7 HEAD does not match GitHub main.')
# Prior manifest allows removal only of previously mirrored tracked files.
manifest = mirror / '.source-files'
files = subprocess.check_output(['git', 'ls-files', '-z'], cwd=root).decode().split('\0')[:-1]
old = manifest.read_text().splitlines() if manifest.exists() else []
for name in old:
    if name not in files:
        target = mirror / name
        if target.is_file():
            target.unlink()
for name in files:
    source = root / name
    target = mirror / name
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(source.read_bytes())
    target.chmod(source.stat().st_mode & 0o777)
manifest.write_text('\n'.join(files) + '\n')
(mirror / '.source-commit').write_text(head + '\n')
for name in files:
    assert (mirror / name).read_bytes() == (root / name).read_bytes(), name
print(f'T7 mirror verified: {head}, {len(files)} tracked files.')
