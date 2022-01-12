import xml2js from "xml2js";
import sha256 from "crypto-js/sha256";
import Base64 from "crypto-js/enc-base64";

class QRGen {
  /**
   * Genera el codigo QR del Archivo XML Firmado
   * @param xml
   * @returns
   */
  generateQR(xml: string, idCSC: string, CSC: string, env: "test" | "prod") {
    return xml2js.parseStringPromise(xml).then((obj) => {
      if (
        !(
          obj &&
          obj["rDE"] &&
          obj["rDE"]["Signature"] &&
          obj["rDE"]["Signature"]
        )
      ) {
        throw new Error("XML debe estar firmado digitalmente");
      }
      obj["rDE"]["gCamFuFD"] = {};

      let qrLink = "https://ekuatia.set.gov.py/consultas";
      if (env == "test") {
        qrLink += "-test";
      }
      qrLink += "/qr?";

      let qr = "";
      const nVersion = obj["rDE"]["dVerFor"][0];

      qr += "nVersion=" + nVersion + "&";

      const id = obj["rDE"]["DE"][0]["$"]["Id"];
      qr += "Id=" + id + "&";

      let dFeEmiDE = obj["rDE"]["DE"][0]["gDatGralOpe"][0]["dFeEmiDE"][0];
      dFeEmiDE = Buffer.from(dFeEmiDE, "utf8").toString("hex");
      qr += "dFeEmiDE=" + dFeEmiDE + "&";

      let dRucRec = "";
      if (
        obj["rDE"]["DE"][0]["gDatGralOpe"][0]["gDatRec"][0]["iNatRec"][0] == 1
      ) {
        dRucRec =
          obj["rDE"]["DE"][0]["gDatGralOpe"][0]["gDatRec"][0]["dRucRec"][0];
        qr += "dRucRec=" + dRucRec + "&";
      } else {
        if (obj["rDE"]["DE"][0]["gDatGralOpe"][0]["gDatRec"][0]["dNumIDRec"]) {
          dRucRec =
            obj["rDE"]["DE"][0]["gDatGralOpe"][0]["gDatRec"][0]["dNumIDRec"][0];
        }
        qr += "dNumIDRec=" + dRucRec + "&";
      }

      let dTotGralOpe = 0;
      if (
        obj["rDE"]["DE"][0]["gTotSub"] &&
        obj["rDE"]["DE"][0]["gTotSub"][0] &&
        obj["rDE"]["DE"][0]["gTotSub"][0]["dTotGralOpe"] &&
        obj["rDE"]["DE"][0]["gTotSub"][0]["dTotGralOpe"][0]
      ) {
        dTotGralOpe = obj["rDE"]["DE"][0]["gTotSub"][0]["dTotGralOpe"][0];
      }
      qr += "dTotGralOpe=" + dTotGralOpe + "&";

      let dTotIVA = 0;
      if (
        obj["rDE"]["DE"][0]["gTotSub"] &&
        obj["rDE"]["DE"][0]["gTotSub"][0] &&
        obj["rDE"]["DE"][0]["gTotSub"][0]["dTotIVA"] &&
        obj["rDE"]["DE"][0]["gTotSub"][0]["dTotIVA"][0]
      ) {
        dTotIVA = obj["rDE"]["DE"][0]["gTotSub"][0]["dTotIVA"][0];
      }
      qr += "dTotIVA=" + dTotIVA + "&";

      const cItems = obj["rDE"]["DE"][0]["gDtipDE"][0]["gCamItem"].length;
      qr += "cItems=" + cItems + "&";

      let digestValue =
        obj["rDE"]["Signature"][0]["SignedInfo"][0]["Reference"][0][
          "DigestValue"
        ][0];
      digestValue = Buffer.from(digestValue, "utf8").toString("hex");
      qr += "DigestValue=" + digestValue + "&";

      qr += "IdCSC=" + idCSC;

      const valueForHash = qr;
      let valueHashed = sha256(valueForHash + CSC);

      qr += "&cHashQR=" + valueHashed;

      obj["rDE"]["gCamFuFD"]["dCarQR"] = {
        _: qrLink + qr,
      };
      var builder = new xml2js.Builder();
      var xmlWithQR = builder.buildObject(obj);
      return xmlWithQR;
    });
  }
}

export default new QRGen();
