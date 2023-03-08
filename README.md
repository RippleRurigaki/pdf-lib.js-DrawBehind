# pdf-lib.js DrawBehind

DrawBehind on [pdf-lib](https://github.com/Hopding/pdf-lib)

## Usage 

SAMPLE Code

``` TS
const pdfData = await PDFDocument.create();
pdfData.addPage(PageSizes.A4);
const behindDraw = new pdfLibBehindDraw(pdfData);
let page1 = pdfData.getPage(0);
page1.drawCircle({ "opacity":1, x:100, y:740,size:100,color:rgb(0.8,0.2,0.2)}); //Red Circle
page1  = behindDraw.begin(0);
page1.drawCircle({ "opacity":1, x:150, y:740,size:100,color:rgb(0.2,0.8,0.2)}); //Green Circle
behindDraw.end();
writeFileSync("output.pdf",await pdfData.save({"useObjectStreams":false}));
```
