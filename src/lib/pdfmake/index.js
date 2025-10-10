import { JSDOM } from 'jsdom';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.vfs;

/** @typedef {import('pdfmake/interfaces').TDocumentDefinitions} DocDef */
/** @typedef {DocDef['header']} DocHeader */
/** @typedef {DocDef['footer']} DocFooter */
/** @typedef {DocDef['content']} DocContent */
/** @typedef {import('pdfmake/interfaces').TableCell} DocTableCell */

class PDFmaker {
  /** @param {DocDef} definition*/
  constructor(
    definition = {
      pageMargins: [40, 120, 40, 72],
    }
  ) {
    this.window = new JSDOM();
    this.definition = definition;
  }

  /** @param {DocHeader} header*/
  setHeader(header) {
    this.definition.header = header;
  }

  /** @param {DocFooter} footer*/
  setFooter(footer) {
    this.definition.footer = footer;
  }

  /** @param {DocContent} content*/
  setContent(content) {
    this.definition.content = content;
  }

  /**
   * @param {DocContent} content
   * @returns {DocContent}*/
  parseContent(content) {
    return content;
  }

  /**
   * @param {DocTableCell[]} content
   * @returns {DocTableCell[]}*/
  parseTableCell(content) {
    return content;
  }

  generate() {
    this.pdf = pdfMake.createPdf(this.definition);
    return this.pdf;
  }

  /**
   * @returns {Promise<Buffer>}
   */
  getBuffer() {
    return new Promise((resolve, reject) => {
      this.pdf.getBuffer((buffer) => {
        if (buffer) resolve(buffer);
        else reject(new Error('Failed to generate PDF buffer'));
      });
    });
  }
}

export default PDFmaker;
