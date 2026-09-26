const fs = require('node:fs')
const path = require('node:path')
const Module = require('node:module')
const assert = require('node:assert/strict')
const ts = require('typescript')
const root = path.resolve(__dirname, '..')
function load(file) {
  const filename = path.join(root, file)
  const m = new Module(filename)
  m.filename = filename
  m.paths = Module._nodeModulePaths(root)
  const original = m.require.bind(m)
  m.require = (id) => id === '../data/specialServices' ? load('src/data/specialServices.ts') : original(id)
  m._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText, filename)
  return m.exports
}
const { createSpecialServicePdf } = load('src/utils/specialServicePdf.ts')
const { specialServices } = load('src/data/specialServices.ts')
const logo = 'data:image/png;base64,' + fs.readFileSync(path.join(root, 'public/logo.png')).toString('base64')
for (const service of specialServices) {
  for (const language of ['en', 'pt', 'es']) {
    const data = { service, language, center: 'National Headquarters', fullName: 'José da Silva', date: '09/26/2026', section1: '', section2: '', ancestors: Array.from({ length: 24 }, (_, i) => ({ name: i === 23 ? 'LAST ANCESTOR' : '', relationship: i === 23 ? 'Grandparent' : '' })) }
    const pdf = createSpecialServicePdf(data, logo)
    assert.equal(pdf.getNumberOfPages(), 1, `${service.slug}/${language}: standard form must fit Letter`)
    assert.equal(pdf.internal.pageSize.getWidth(), 612)
    assert.equal(pdf.internal.pageSize.getHeight(), 792)
    const commands = pdf.internal.pages.flat().join('\n')
    assert.ok(commands.includes('José da Silva'), 'Selectable name text missing')
    if (service.slug === 'annual-ancestors') assert.ok(commands.includes('LAST ANCESTOR'))
    else {
      assert.equal(service.copy[language].section1Lines, 17)
      assert.equal(service.copy[language].section2Lines, 15)
    }
    if (process.env.PDF_QA_DIR) {
      fs.mkdirSync(process.env.PDF_QA_DIR, { recursive: true })
      fs.writeFileSync(path.join(process.env.PDF_QA_DIR, `${service.slug}-${language}.pdf`), Buffer.from(pdf.output('arraybuffer')))
    }
    const longData = { ...data, section1: 'Long response. '.repeat(1200) + 'END FIRST', section2: 'Second response. '.repeat(900) + 'END SECOND', ancestors: Array.from({ length: 24 }, () => ({ name: 'Long ancestor name '.repeat(30), relationship: 'Grandparent' })) }
    const overflow = createSpecialServicePdf(longData, logo)
    assert.ok(overflow.getNumberOfPages() > 1)
    if (service.slug !== 'annual-ancestors') {
      const text = overflow.internal.pages.flat().join('\n')
      assert.ok(text.includes('END FIRST') && text.includes('END SECOND'), 'Overflow text lost')
    }
    console.log(`${service.slug}/${language}: Letter page, selectable text, overflow passed`)
  }
}
