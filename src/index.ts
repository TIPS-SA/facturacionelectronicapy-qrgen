import qrGen from "./QRGen";

class QRGen {
  generateQR = (
    xmlSigned: string,
    idCSC: string,
    CSC: string,
    env: "test" | "prod"
  ): Promise<any> => {
    return qrGen.generateQR(xmlSigned, idCSC, CSC, env);
  };
}

export default new QRGen();
