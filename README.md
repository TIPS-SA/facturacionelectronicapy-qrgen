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
.generateQR(xmlSigned, idCSC, CSC, env)
.then(xml => console.log("XML con QR", xml));


```

Para saber como generar el Archivo XML visita éste proyecto de Git visitar: 
https://github.com/marcosjara/facturacionelectronicapy-xmlgen

=======
## Todos los proyectos
[Generación de XML](https://www.npmjs.com/package/facturacionelectronicapy-xmlgen)<br/>
[Firma de XML](https://www.npmjs.com/package/facturacionelectronicapy-xmlsign)<br/>
[Generación de QR](https://www.npmjs.com/package/facturacionelectronicapy-qrgen)<br/>
[API de SIFEN](https://www.npmjs.com/package/facturacionelectronicapy-setapi)<br/>
[Generación KUDE](https://www.npmjs.com/package/facturacionelectronicapy-kude)<br/>

## Empresas que utilizan éstos proyectos
[JHF Ingeniería Informática](https://jhf.com.py/)<br/>
[JR Ingeniería y Servicios](https://jringenieriayservicios.com/)<br/>
[FacturaSend](https://www.facturasend.com.py/)<br/>
