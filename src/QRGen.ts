import xml2js from 'xml2js';
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

class QRGen {

    /**
     * Genera el codigo QR del Archivo XML Firmado
     * @param xml 
     * @returns 
     */
    generateQR(xml: string, env: "test" | "prod") {
        
        return xml2js.parseStringPromise(xml).then(obj => {

            if (!(obj && obj['rDE'] && obj['rDE']['Signature'] && obj['rDE']['Signature'])) {
                throw new Error("XML debe estar firmado digitalmente");
            }
            obj['rDE']['gCamFuFD'] = {};
            
            let qr = "https://ekuatia.set.gov.py/consultas";
            if (env == 'test') {
                qr += "-test";
            }
            qr += "/qr?";
            
            const nVersion = obj['rDE']['dVerFor'][0];

            qr += "nVersion=" + nVersion + "&";

            const id = obj['rDE']['DE'][0]['$']['Id'];
            qr += "Id=" + id + "&";

            let dFeEmiDE = obj['rDE']['DE'][0]['gDatGralOpe'][0]['dFeEmiDE'][0];
            dFeEmiDE = Buffer.from(dFeEmiDE, 'utf8').toString('hex');
            qr += "dFeEmiDE=" + dFeEmiDE + "&";

            let dRucRec = "";
            if (obj['rDE']['DE'][0]['gDatGralOpe'][0]['gDatRec'][0]['iNatRec'][0] == 1) {
                dRucRec = obj['rDE']['DE'][0]['gDatGralOpe'][0]['gDatRec'][0]['dRucRec'][0];
                qr += "dRucRec=" + dRucRec + "&";
            } else {
                dRucRec = obj['rDE']['DE'][0]['gDatGralOpe'][0]['gDatRec'][0]['dNumIDRec'][0];
                qr += "dRucRec=" + dRucRec + "&";
            }
            
            const dTotGralOpe = obj['rDE']['DE'][0]['gTotSub'][0]['dTotGralOpe'][0];
            qr += "dTotGralOpe=" + dTotGralOpe + "&";
            
            const dTotIVA = obj['rDE']['DE'][0]['gTotSub'][0]['dTotIVA'][0];
            qr += "dTotIVA=" + dTotIVA + "&";

            const cItems = obj['rDE']['DE'][0]['gDtipDE'][0]['gCamItem'][0].length;
            qr += "cItems=" + cItems + "&";
            
            let digestValue = obj['rDE']['Signature'][0]['SignedInfo'][0]['Reference'][0]['DigestValue'][0];
            digestValue = Buffer.from(digestValue, 'utf8').toString('hex');
            qr += "DigestValue=" + digestValue + "&";

            const idCSC = "001";
            qr += "IdCSC=" + idCSC + "&";

            const valueForHash = nVersion + id + dFeEmiDE + dRucRec + dTotGralOpe + dTotIVA + cItems + digestValue + idCSC;
            let valueHashed = sha256(valueForHash);
            //valueHashed = Base64.stringify(valueHashed);

            qr += "cHashQR=" + valueHashed;

            obj['rDE']['gCamFuFD']['dCarQR'] = {
                _ : qr
            };
            var builder = new xml2js.Builder();
            var xmlWithQR = builder.buildObject(obj);
            return xmlWithQR;
            
        });
        //return xml;
    }
}

export default new QRGen();

