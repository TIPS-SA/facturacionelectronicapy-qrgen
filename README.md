# Facturación Electrónica - Generación del Valor para el código QR (Paraguay)
Este módulo NodeJS genera el campo AA002 con el valor correspondiente para el código QR. Requiere para ello un documento electrónico XML firmado, del cual tomará los datos y generará el código.

## Instalación

```
$ npm install facturacionelectronicapy-qrgen
```

## Generación del código QR

TypeScript:
```typescript
import qrgen from 'facturacionelectronicapy-qrgen';

qrgen
.generateQR(xmlSigned)
.then(xml => console.log("XML con QR", xml));

```

Para saber como generar el Archivo XML visita éste proyecto de Git: 
https://github.com/marcosjara/facturacionelectronicapy-xmlgen
