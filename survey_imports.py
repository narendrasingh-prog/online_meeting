import pathlib, re
pattern = re.compile(r'@/components/[A-Z]')
for path in pathlib.Path('.').rglob('*'):
    if 'node_modules' in path.parts or '.next' in path.parts:
        continue
    if not path.is_file():
        continue
    if path.suffix.lower() not in {'.ts','.tsx','.js','.jsx','.mjs','.cjs'}:
        continue
    text = path.read_text(encoding='utf8', errors='ignore')
    if pattern.search(text):
        print(path)
