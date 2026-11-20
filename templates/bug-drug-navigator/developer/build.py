import os,shutil,hashlib,datetime
import pathlib; os.chdir(pathlib.Path(__file__).parent); S='src';O='../build'
shutil.rmtree(O,ignore_errors=True)
for d in ['css','js','standalone']: os.makedirs(f'{O}/{d}')
APPHASH=hashlib.sha256(open(f'{S}/app.js','rb').read()).hexdigest()[:12]
CV='2026-11-17+'+APPHASH
css=open(f'{S}/styles.css').read();app=open(f'{S}/app.js').read();ui=open(f'{S}/ui.js').read();an=open(f'{S}/analytics.js').read().replace('__CV__',CV);conf=open(f'{S}/config.js').read();adm=open(f'{S}/admin.js').read().replace('__APPHASH__',APPHASH);cpk=open(f'{S}/content-pack.js').read();viz=open(f'{S}/viz.js').read();body=open(f'{S}/body.html').read()
FONT='<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">'
ICON=open(os.path.join(S,'icon-links.html')).read()
META=ICON+'<meta name="description" content="Anti-infective spectrum reference: which antibacterials, antifungals, antivirals, TB and antiparasitic drugs cover which organisms — referenced and updated 2026.">\n<meta name="theme-color" content="#0e4c92">'
def head(extra,styles):
    return f'<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n{extra}<title>Spectra · Hulool 360°</title>\n{META}\n{FONT}\n{styles}\n</head>\n<body>\n'
tail='<script src="js/config.js" defer></script>\n<script src="js/content-pack.js" defer></script>\n<script src="js/app.js" defer></script>\n<script src="js/viz.js" defer></script>\n<script src="js/ui.js" defer></script>\n<script src="js/admin.js" defer></script>\n<script src="js/analytics.js" defer></script>\n</body>\n</html>\n'
CSP='<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\'; style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src \'self\' data:; base-uri \'none\'; form-action \'none\'">\n'
open(f'{O}/index.html','w').write(head('','<link rel="stylesheet" href="css/styles.css">')+body+tail)
open(f'{O}/index-csp.html','w').write(head(CSP,'<link rel="stylesheet" href="css/styles.css">')+body+tail)
open(f'{O}/standalone/spectra.html','w').write(head('',f'<style>\n{css}</style>')+body+f'<script>\n{conf}\n</script>\n<script>\n{cpk}\n</script>\n<script>\n{app}\n</script>\n<script>\n{viz}\n</script>\n<script>\n{ui}\n</script>\n<script>\n{adm}\n</script>\n<script>\n{an}\n</script>\n</body>\n</html>\n')
open(f'{O}/css/styles.css','w').write(css);open(f'{O}/js/app.js','w').write(app);open(f'{O}/js/ui.js','w').write(ui);open(f'{O}/js/viz.js','w').write(viz);open(f'{O}/js/analytics.js','w').write(an);open(f'{O}/js/config.js','w').write(conf);open(f'{O}/js/admin.js','w').write(adm);open(f'{O}/js/content-pack.js','w').write(cpk)
print('built')
