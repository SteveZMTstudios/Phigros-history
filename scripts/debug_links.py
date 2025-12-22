#!/usr/bin/env python3
import importlib.util, json, sys
spec = importlib.util.spec_from_file_location('mdparser','scripts/md_to_versions_json.py')
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
with open('ver_data/VersionList_2.x.md','r',encoding='utf-8') as f:
    md = f.read()
res = mod.parse_markdown_versions(md, debug=False)
for d in res['details']:
    if d['versionName'] in ('v2.4.5','v2.4.6','v2.4.7'):
        print('---', d['versionName'])
        print('downloads:', json.dumps(d.get('downloads',{}),ensure_ascii=False,indent=2))
        # find block start to inspect raw lines
        lines = md.splitlines()
        start = None
        for i,l in enumerate(lines):
            if l.strip().startswith('###') and d['versionName'].lstrip('v') in l:
                start = i
                break
        if start is not None:
            snippet = lines[start:start+20]
            print('\n'.join(snippet))
        else:
            print('block not found')
print('\nDone')
