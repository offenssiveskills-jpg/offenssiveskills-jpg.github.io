const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const files = [
  { html: 'Hippolyte_Donfack_CV_FR.html', pdf: 'Hippolyte_Donfack_CV_FR.pdf' },
  { html: 'Hippolyte_Donfack_CV_EN.html', pdf: 'Hippolyte_Donfack_CV_EN.pdf' }
];

function buildPdf(index) {
  if (index >= files.length) {
    console.log('All PDFs compiled successfully.');
    return;
  }
  
  const htmlFile = path.join(__dirname, files[index].html);
  const pdfFile = path.join(__dirname, files[index].pdf);
  
  const args = [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--print-to-pdf=${pdfFile}`,
    '--print-to-pdf-no-header',
    '--no-margins',
    `file:///${htmlFile.replace(/\\/g, '/')}`
  ];

  console.log(`Compiling [${index+1}/${files.length}] ${files[index].html} -> ${files[index].pdf}`);
  
  const proc = spawn(edgePath, args);
  let stderrData = '';
  proc.stderr.on('data', (data) => { stderrData += data.toString(); });
  
  proc.on('close', (code) => {
    if (code === 0 && fs.existsSync(pdfFile)) {
      const stats = fs.statSync(pdfFile);
      console.log(`  Success! Size: ${(stats.size / 1024).toFixed(2)} KB`);
      buildPdf(index + 1);
    } else {
      console.error(`  Error: Edge exited with code ${code}`);
      console.error('  Stderr:', stderrData);
    }
  });
}

buildPdf(0);
