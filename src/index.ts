import qrGen from './QRGen';

class QRGen {
    generateQR = (xmlSigned: string) : Promise<any> => {
        return qrGen.generateQR(xmlSigned);
    }
}

export default new QRGen();
