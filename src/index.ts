import qrGen from "./QRGen";

class QRGen {
  generateQR = (
    xmlSigned: string,
    idCSC: string,
    CSC: string,
    infoAdicional: any,
    env: "test" | "prod"
  ): Promise<any> => {
    return qrGen.generateQR(xmlSigned, idCSC, CSC, infoAdicional, env);
  };
}

export default new QRGen();
