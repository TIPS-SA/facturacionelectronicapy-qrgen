import qrGen from './QRGen';

class QRGen {
    generateQR = (xmlSigned: string, env: "test" | "prod") : Promise<any> => {
        return qrGen.generateQR(xmlSigned, env);
    }
}

export default new QRGen();
