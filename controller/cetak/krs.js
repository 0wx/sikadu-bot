const puppeteer = require('puppeteer');

async function getPdf(nim, sesion, cb) {

    const tmp = './tmp/krs-' + nim + '-' + Math.floor(new Date() / 1000) + '.pdf';
    try {
        console.log(tmp)
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', request => {
            if (!request.isNavigationRequest()) {
                request.continue();
                return;
            }
            const headers = request.headers();
            headers['Cookie'] = sesion;
            request.continue({ headers });
        });
        await page.goto('http://sikadu.unwahas.ac.id/sia/ctk_krs_mhs.php?kdmhs='+ nim, { waitUntil: 'networkidle0' });
        await page.pdf({
            path: tmp, format: 'A4', margin: { top: 30, left: 30, right: 30, bottom: 0 }, preferCSSPageSize: true,
            printBackground: true, fullPage: true
        });

        await browser.close();
    }
    catch (err) {
        cb(false)
        console.log(err)
    }
    finally {
        cb(tmp)
    }
}

module.exports = getPdf;