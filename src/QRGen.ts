import xml2js from 'xml2js';


class QRGen {

    /**
     * Genera el codigo QR del Archivo XML Firmado
     * @param xml 
     * @returns 
     */
    generateQR(xml: string, env: "test" | "prod") {
        
        return xml2js.parseStringPromise(xml).then(obj => {
            console.dir(obj);

            if (!(obj && obj['rDE'] && obj['rDE']['Signature'] && obj['rDE']['Signature'])) {
                throw new Error("XML debe estar firmado digitalmente");
            }
            obj['rDE']['gCamFuFD'] = {};
            
            let qr = "https://ekuatia.set.gov.py/consultas-test/qr?";
            if (env == 'test') {
                qr += "-test";
            }
            qr += "/qr?";
            const nVersion = obj['rDE']['dVerFor'];
            qr += "nVersion=" + nVersion + "&amp;";

            const id = obj['rDE']['DE']['_attributes']['Id'];
            qr += "Id=" + id + "&amp;";

            let dFeEmiDE = obj['rDE']['DE']['gDatGralOpe']['dFeEmiDE'];
            dFeEmiDE = Buffer.from(dFeEmiDE, 'utf8').toString('hex');
            qr += "dFeEmiDE=" + dFeEmiDE + "&amp;";

            let dRucRec = "";
            if (obj['rDE']['DE']['gDatGralOpe']['gDatRec']['iNatRec'] == 1) {
                dRucRec = obj['rDE']['DE']['gDatGralOpe']['gDatRec']['dRucRec'];
                qr += "dRucRec=" + dRucRec + "&amp;";
            } else {
                dRucRec = obj['rDE']['DE']['gDatGralOpe']['gDatRec']['dNumIDRec'];
                qr += "dRucRec=" + dRucRec + "&amp;";
            }
            
            const dTotGralOpe = obj['rDE']['DE']['gTotSub']['dTotGralOpe'];
            qr += "dTotGralOpe=" + dTotGralOpe + "&amp;";
            
            const dTotIVA = obj['rDE']['DE']['gTotSub']['dTotIVA'];
            qr += "dTotIVA=" + dTotIVA + "&amp;";

            const cItems = obj['rDE']['DE']['gDtipDE']['gCamItem'].length;
            qr += "cItems=" + cItems + "&amp;";
            
            let digestValue = obj['rDE']['Signature']['SignedInfo']['Reference']['DigestValue'];
            digestValue = Buffer.from(digestValue, 'utf8').toString('hex');
            qr += "DigestValue=" + digestValue + "&amp;";

            const idCSC = "001";
            qr += "IdCSC=" + idCSC + "&amp;";

            const valueForHash = nVersion + id + dFeEmiDE + dRucRec + dTotGralOpe + dTotIVA + cItems + digestValue + idCSC;
            const valueHashed = "";

            qr += "cHashQR=" + valueHashed;

            obj['rDE']['gCamFuFD']['dCarQR'] = qr;

            var builder = new xml2js.Builder();
            var xmlWithQR = builder.buildObject(obj);
            return xmlWithQR;
            
        });
        //return xml;
    }
}

export default new QRGen();

