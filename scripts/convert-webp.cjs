const sharp = require('sharp');
const fs = require('fs');
const pub = './public';

const others = [
  [pub+'/images/reason-negotiation.jpg', pub+'/images/reason-negotiation.webp'],
  [pub+'/images/reason-negotiation-v2.jpg', pub+'/images/reason-negotiation-v2.webp'],
  [pub+'/images/reason-compliance.jpg', pub+'/images/reason-compliance.webp'],
  [pub+'/images/reason-compliance-v2.jpg', pub+'/images/reason-compliance-v2.webp'],
  [pub+'/images/reason-nationwide.jpg', pub+'/images/reason-nationwide.webp'],
  [pub+'/images/reason-nationwide-v3.jpg', pub+'/images/reason-nationwide-v3.webp'],
  [pub+'/images/step-acceptance.jpg', pub+'/images/step-acceptance.webp'],
  [pub+'/images/step-acceptance-v3.jpg', pub+'/images/step-acceptance-v3.webp'],
  [pub+'/images/step-burial-cert.jpg', pub+'/images/step-burial-cert.webp'],
  [pub+'/images/step-permit.jpg', pub+'/images/step-permit.webp'],
  [pub+'/images/company-office.jpg', pub+'/images/company-office.webp'],
  [pub+'/pricing-before.jpg', pub+'/images/pricing-before.webp'],
  [pub+'/pricing-after.jpg', pub+'/images/pricing-after.webp'],
];

(async () => {
  for(const [s, d] of others) {
    if(!fs.existsSync(s)) { console.log('skip:', s); continue; }
    await sharp(s).resize(1200, null, { withoutEnlargement: true }).webp({ quality: 78 }).toFile(d);
    const src_s = fs.statSync(s).size;
    const dst_s = fs.statSync(d).size;
    console.log(d.split('/').pop(), ':', Math.round(src_s/1024)+'KB', '->', Math.round(dst_s/1024)+'KB');
  }
})();
