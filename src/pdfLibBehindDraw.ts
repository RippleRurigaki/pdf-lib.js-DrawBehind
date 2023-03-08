import {PDFDocument,PDFPage,PDFRef,PDFArray,PDFName} from "pdf-lib";

export class pdfLibBehindDraw{
    private pdfDoc:PDFDocument;
    private page?:PDFPage;
    private contentRef?:Array<PDFRef>
    constructor(pdfdoc:PDFDocument){
        this.pdfDoc = pdfdoc;
    }
    public begin = (index:number):PDFPage => {
        this.page = this.pdfDoc.getPage(index);
        this.contentRef = [];
        const pageContents = this.page.node.get(PDFName.Contents);
        if(pageContents instanceof PDFRef){
            this.contentRef.push(pageContents)
        }else if(pageContents instanceof PDFArray){
            this.contentRef.push(...pageContents.asArray() as Array<PDFRef>);
        }
        //@ts-ignore :Private property,Draw commands stream initialize.
        delete this.page.contentStream;
        return this.page;
    }
    public end = () => {
        if(!this.page || !this.contentRef){
            return;
        }
        const updatedContents = this.page.node.get(PDFName.Contents);
        if(updatedContents instanceof PDFArray){
            const replaceConts = PDFArray.withContext(this.pdfDoc.context);
            for(const contentRef of updatedContents.asArray() as Array<PDFRef>){
                if(!this.contentRef.find(v=>{
                    if(v.objectNumber === contentRef.objectNumber){
                        return true;
                    }
                })){
                    replaceConts.push(contentRef);
                }
            }
            for(const contentRef of this.contentRef){
                replaceConts.push(contentRef);
            }
            this.page.node.set(PDFName.Contents,replaceConts);
        }
        //@ts-ignore :Private property,Draw commands stream initialize.
        delete this.page.contentStream;
        delete this.page;
        delete this.contentRef;
    }
}