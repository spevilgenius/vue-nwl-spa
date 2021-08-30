import {
  File,
  AlignmentType,
  Document as WordDoc,
  HeadingLevel,
  Paragraph,
  Header,
  Footer,
  PageNumberFormat,
  TabStopPosition,
  TabStopType,
  Styles,
  TextRun,
  SectionProperties,
  SectionPropertiesOptions,
  ISectionOptions,
  Media,
  XmlComponent,
  HyperlinkRef,
  Table,
  TableOfContents,
  TableRow,
  TableCell,
  EmphasisMarkType,
  PictureRun,
  WidthType,
  IParagraphOptions,
  IRunOptions,
  ITableRowOptions,
  HeightRule, 
  VerticalAlign,
  TextDirection,
  VerticalMergeType,
  BorderStyle,
  ShadingType,
  UnderlineType,
  ITableFloatOptions,
  TableLayoutType,
  ITableBordersOptions,
  ITableCellOptions,
} from 'file'
  
import axios from 'axios';
import * as sizeOf from "image-size";
import * as styleAttr from "style-attr";
import { forEach } from 'jszip';
import { doc } from 'prettier';

type TopLvlDocPart = Paragraph|HyperlinkRef|Table|TableOfContents;
type OptTopLvlDocPart = TopLvlDocPart|null;
type TableCellDocPart = Paragraph|Table;
type ParagraphDocPart = TextRun | PictureRun;

export interface ICreateDocFromHtmlOptions {
 id: string
  header?: Header;
  footer?: Footer;
  coverpage?: [];
  styles?: Styles;
  sectionwidth: number;
  sectionheight: number;
  sectionmargins: {
    top: number;
   right: number;
   bottom: number;
   left: number;
   header: number;
   footer: number;
   gutter: number;
  };
 alignment?: AlignmentType;
}

export class CreateDocFromHtml {
  private id: string;
  private level: number;
  // tslint:disable-next-line: prefer-readonly
  private wordDoc: File;
  private header?: any;
  private footer?: any;
  private coverpage?: [];
  private styles?: any;
  private height: number;
  private width: number;
  private margins: {
   top: number;
   right: number;
   bottom: number;
   left: number;
   header: number;
   footer: number;
   gutter: number;
  }
  private alignment?: AlignmentType;
  private imgMap: Map<string, Buffer> = new Map();
  private CUIimgMap: Map<string, Buffer> = new Map();
  private imgArray: Element[] = [];

  constructor({
    id,
    header,
    footer,
    coverpage,
    styles,
    sectionwidth,
    sectionheight,
    sectionmargins,
    alignment
  }: ICreateDocFromHtmlOptions) {
    // pass in some information to create the document
    // filename should be passed and location of library to save to if saving to library
    // boolean for saving locally or to library
    this.id = id
    this.header = header
    this.footer = footer
    this.coverpage = coverpage
    this.styles = styles!
    this.width = sectionwidth
    this.height = sectionheight
    this.margins = sectionmargins
    this.alignment = alignment
    this.level = -1
  }

  // tslint:disable-next-line: typedef
  public getImagesFromSource() {
    const domParser = new DOMParser();
    const element = document.getElementById(this.id)!
    const htmlDoc = domParser.parseFromString(element.innerHTML, "text/html")
    
    const imgNodes = htmlDoc.evaluate('//img', htmlDoc, null, XPathResult.ANY_TYPE, null);
    if (imgNodes != null) {
      let imgNode = imgNodes.iterateNext();
      while (imgNode) {
        if (imgNode instanceof Element) {
          const imgElem = imgNode as Element;
          this.imgArray.push(imgElem);
        }
        imgNode = imgNodes.iterateNext();
      }
    }
  }

  // tslint:disable-next-line: typedef
  public async loadImages() {
    for (const imgNode of this.imgArray) {
      const src = imgNode.getAttribute("src")
      // if (console) { console.log("IMAGE SOURCE: " + src) }
      await this.retrieveImage(src!);
    }
  }

  // tslint:disable-next-line: typedef
  public async retrieveImage(url: string) {
    // if (console) { console.log("retrieving image " + url); }
    const resp = await axios.get(url, {responseType: 'arraybuffer'});
    const data = resp.data;
    if (data != null) {
        this.imgMap.set(url, Buffer.from(data));
    }
  }

  // tslint:disable-next-line: typedef
  public async retrieveCUIImage(url: string) {
    const resp = await axios.get(url, {responseType: 'arraybuffer'});
    const data = resp.data;
    if (data != null) {
      console.log('SETTING UP THE CUI IMAGE');
      this.CUIimgMap.set(url, Buffer.from(data));
    }
  }

  public pushAll<T>(appendTo: T[], appendFrom: T[]): T[] {
    for (const appendItem of appendFrom) {
      appendTo.push(appendItem);
    }
    return appendTo;
  }

  /* public addClass = (element, name) => {
    const arr = element.className.split(" ");
    if (arr.indexOf(name) === -1) {
        element.className += " " + name;
    }
  }; */

  public replacetags(root: Element, tag: string): void {
    // just do it
    let node: any
    const nodes = root.childNodes
    let tagname: any

    for (let i = 0; i < nodes.length; i++) {
      node = nodes[i]
      tagname = node.tagName && node.tagName.toLowerCase();
      if (tagname === tag) {
        node.setAttribute("id", "removeme")
        const h = node.innerHTML
        const span = document.createElement("span")
        span.innerHTML = h
        const t = document.getElementById("removeme")
        t?.parentNode?.replaceChild(span, t)
        this.replacetags(node, tag)
      } else if (node.nodeType === 1) {
        this.replacetags(node, tag)
      }
    }
  }

  public fixuplevels(root: Element, attr: string, layer: number): void {
    // just do it
    // tslint:disable-next-line: no-parameter-reassignment
    layer = layer || 0
    let node: any
    const nodes = root.childNodes
    let tagname: any

    for (let i = 0; i < nodes.length; i++) {
      node = nodes[i]
      tagname = node.tagName && node.tagName.toLowerCase();
      if (tagname === "li") {
        node.setAttribute("level", layer)
        this.fixuplevels(node, attr, layer + 1)
      } else if (node.nodeType === 1) {
        this.fixuplevels(node, attr, layer)
      }
    }
  }

  public create(): File {
    const docParts: TopLvlDocPart[] = [];

    this.wordDoc = new File({
      creator: 'CACI-DOCX',
      title: 'Will be calculated',
      styles: this.styles,
    });

    // Add the new CUI cover first
    const src = ""
    this.retrieveCUIImage(src);
    const img = this.CUIimgMap.get(src);
    if (img != null) {
      console.log('CREATING THE CUI COVER PAGE.')
      const dimensions = sizeOf.imageSize(img);
      const imgWidth = dimensions.width;
      const imgHeight = dimensions.height;
      const newHeight = Math.floor((720*imgHeight!)/imgWidth!);
      const pictureRun = Media.addImage(this.wordDoc, img, 720, newHeight);
      this.wordDoc.addSection({
        children: [
          new Paragraph(pictureRun)
        ],
        margins: {
          top: 720,
          right: 720,
          bottom: 720,
          left: 720,
          header: 0,
          footer: 0,
          gutter: 0
        }
      })
    }

    if (this.coverpage && this.coverpage.length > 0) {
      this.pushAll(docParts, this.coverpage);
    }
    
    const element = document.getElementById(this.id)!

    // first fix some known bad tags and then recursively loop the element to get all the ul/li areas and create level attrubutes based on their location in the dom tree
    this.replacetags(element, "o:p")
    this.fixuplevels(element, "LEVEL", 0)

    const space = document.getElementById("LogSpace")!
    space.innerHTML = element.innerHTML

    for (const elem of element.children) {
      const nodeName = elem.nodeName.toLowerCase();
      // console.log(nodeName);
      switch (nodeName) {
        case "div":
          this.pushAll(docParts, this.getDocumentParts(elem))
          break;
      }
    }

    // console.log("Finished Parsing! Parts Length: " + docParts.length)

    const sectionOptions: ISectionOptions[] = [{
      headers: {
        default: new Header({
          children: [this.header]
        })
      },
      footers: {
        default: new Footer({
          children: [this.footer]
        })
      },
      children: docParts,
      properties: {
        pageNumberStart: 1,
        pageNumberFormatType: PageNumberFormat.DECIMAL
      },
      size: {
        width: this.width,
        height: this.height
      },
      margins: {
        top: this.margins.top,
        right: this.margins.right,
        bottom: this.margins.bottom,
        left: this.margins.left,
        header: this.margins.header,
        footer: this.margins.footer,
        gutter: this.margins.gutter
      }
    }]

    this.wordDoc.addSection(sectionOptions[0])
    
    return this.wordDoc
  }

  public getDocumentParts(elem: Element): TopLvlDocPart[] {
    const htmlDocParts: TopLvlDocPart[] = [];
    for (const child of elem.children) {
      const nodeName = child.nodeName.toLowerCase();
      // console.log("getDocumentParts " + nodeName);
      switch (nodeName) {
        case "div":
          for (const childElem of child.children) {
            const docPart: OptTopLvlDocPart[] = this.getDocumentPart(childElem)!;
            if (docPart !== null) {
              this.pushAll(htmlDocParts, docPart);
            }
          }
          break;
        default:
          console.log('getDocumentParts Unhandled element: ' + elem.nodeName);
      }
    }
    // console.log("getDocumentParts parts length " + htmlDocParts.length)
    return htmlDocParts;
  }

  public getDocumentPart(elem: Element): OptTopLvlDocPart[] {
    const htmlDocPart: OptTopLvlDocPart[] = [];
    const nodeName = elem.nodeName.toLowerCase();
    // console.log("getDocumentPart " + nodeName);
    switch (nodeName) {
      case 'div':
        for (const child of elem.children) {
          this.pushAll(htmlDocPart, this.getDocumentPart(child));
        }
        break;
      case 'ul':
        for (const child of elem.children) {
          this.pushAll(htmlDocPart, this.getDocumentPart(child));
        }
        break;
      case 'li':
        if (elem.children && elem.children.length > 0) {
          htmlDocPart.push(this.getParagraph(elem));
          for (const child of elem.children) {
            if (child.nodeName.toLowerCase() === "ul") {
              this.pushAll(htmlDocPart, this.getDocumentPart(child));
            }
          }
        } else {
          htmlDocPart.push(this.getParagraph(elem));
        }
        break;
      case 'h1':
        this.level = 0;
        htmlDocPart.push(this.getHeading(elem, 1));
        break;
      case 'h2':
        this.level = 0;
        htmlDocPart.push(this.getHeading(elem, 2));
        break;
      case 'h3':
        this.level = 0;
        htmlDocPart.push(this.getHeading(elem, 3));
        break;
      case 'h4':
        this.level = 0;
        htmlDocPart.push(this.getHeading(elem, 4));
        break;
      case 'h5':
        this.level = 0;
        htmlDocPart.push(this.getHeading(elem, 5));
        break;
      case 'p':
        this.level = 0;
        htmlDocPart.push(this.getParagraph(elem));
        break;
      case 'table':
        this.level = 0;
        htmlDocPart.push(this.getTable(elem));
        break;
      default:
        this.level = 0;
        console.log('getDocumentPart Unhandled child element: ' + nodeName);
    }
    return htmlDocPart;
  }

  public getHeading(elem: Element, level: number): Paragraph {
    // console.log("getHeading called text: " + elem.textContent + ", level: " + level)
    let headingPart!: Paragraph;
    // headingPart = new Paragraph({}) // Set to empty first to set instance and account for unhandled headings
    const centered = elem.classList.contains('text-center')
    switch (level) {
      case 1:
        headingPart = new Paragraph({
          text: elem.textContent!,
          heading: HeadingLevel.HEADING_1,
          alignment: centered === true ? AlignmentType.CENTER : AlignmentType.LEFT,
        });
        break;
      case 2:
        headingPart = new Paragraph({
          text: elem.textContent!,
          heading: HeadingLevel.HEADING_2,
          alignment: centered === true ? AlignmentType.CENTER : AlignmentType.LEFT,
        });
        break;
      case 3:
        headingPart = new Paragraph({
          text: elem.textContent!,
          heading: HeadingLevel.HEADING_3,
          alignment: centered === true ? AlignmentType.CENTER : AlignmentType.LEFT,
        });
        break;
      case 4:
        headingPart = new Paragraph({
          text: elem.textContent!,
          heading: HeadingLevel.HEADING_4,
          alignment: centered === true ? AlignmentType.CENTER : AlignmentType.LEFT,
        });
        break;
      case 5:
        headingPart = new Paragraph({
          text: elem.textContent!,
          heading: HeadingLevel.HEADING_5,
          alignment: centered === true ? AlignmentType.CENTER : AlignmentType.LEFT,
        });
        break;
    }
    return headingPart
  }

  public getTable(elem: Element): Table {
    const style = this.getStyle(elem);
    const tableRows: TableRow[] = [];
    for (const childElem of elem.children) {
      const nodeName = childElem.nodeName.toLowerCase();
      // console.log(nodeName);
      switch (nodeName) {
        case "thead":
          this.pushAll(tableRows, this.getTableRows(childElem));
          break;
        case "tbody":
          this.pushAll(tableRows, this.getTableRows(childElem));
          break;
        case "tfoot":
          this.pushAll(tableRows, this.getTableRows(childElem));
          break;
        case "tr":
          tableRows.push(this.getTableRow(childElem));
          break;
        default:
          console.log("Unhandled " + elem.nodeName.toLowerCase() + " child element: " + nodeName);
      }
    }
    const tableOptions = {
      rows: tableRows,
      width: {
          size: 100,
          type: WidthType.PERCENTAGE
      },
      margins: {
          top: 1,
          bottom: 1,
          left: 1,
          right: 1,
      }
    };
    const table = new Table(tableOptions);
    return table;
  }

  public getTableRows(elem: Element): TableRow[] {
    const tableRows: TableRow[] = [];
    for (const childElem of elem.children) {
      const nodeName = childElem.nodeName.toLowerCase();
      // console.log(nodeName);
      switch (nodeName) {
        case "tr":
          tableRows.push(this.getTableRow(childElem));
          break;
        default:
          console.log("Unhandled " + elem.nodeName.toLowerCase() + " child element: " + nodeName);
      }
    }
    return tableRows;
  }

  public getTableRow(elem: Element): TableRow {
    // const style = this.getStyle(elem);
    const tableCells: TableCell[] = [];
    for (const childElem of elem.children) {
      const nodeName = childElem.nodeName.toLowerCase();
      // console.log(nodeName);
      switch (nodeName) {
        case "td":
          tableCells.push(this.getTableCell(childElem));
          break;
        default:
          console.log("Unhandled " + elem.nodeName.toLowerCase() + " child element: " + nodeName);
      }
    }
    const tableRowOptions: ITableRowOptions = {
        children: tableCells,
        cantSplit: true,
        tableHeader: false,
        height: {
            height: 0,
            rule: HeightRule.AUTO
        }
    }
    const tableRow = new TableRow(tableRowOptions);
    return tableRow;
  }

  public getTableCell(elem: Element): TableCell {
    const style = this.getStyle(elem);
    let background = "ffffff" // default white shading
    let color = "000000" // default white shading
    let width: any
    Object.keys(style).forEach(key => {
      // console.log("getTableCell style attr - " + key + " = " + style[key])
      switch (key) {
        case "background":
          background = String(style[key]);
          if (background === "black") {
            background = "000000"
          }
          if (background === "white") {
            background = "ffffff"
          }
          if (background === "yellow") {
            background = "ffff00"
          }
          if (background === "red") {
            background = "ff0000"
          }
          if (background.indexOf("rgb") >= 0) {
            // convert rgb to hex without leading #
            background = this.rgb2hex(background)
          }
          break;
        
        case "color":
          color = String(style[key]);
          if (color === "black") {
            color = "000000"
          }
          if (color === "white") {
            color = "ffffff"
          }
          if (color.indexOf("rgb") >= 0) {
            // convert rgb to hex without leading #
            color = this.rgb2hex(color)
          }
          break;
        
        case "width":
          width = String(style[key])
          // width defined as pt
          if (width.indexOf("pt") > 0) {
            const end = width.indexOf("pt")
            const val = width.substring(0, end)
            width = Number(val)
            width = width * 20
          }

      }
    });
    // Determine column or row span -- for now just column span
    let span = 0;
    const colspan = elem.getAttribute("colspan")
    if (colspan !== null && colspan.length > 0) {
      span = Number(colspan)
    }
    // TODO: dtermine usable attributes of the TD element to see if it can be styled. Hide or remove when done
    elem.getAttributeNames().forEach(attribute => {
      console.log("getTableCell: getAttributeNames - " + attribute.toLowerCase())
    })
    const tableCellChildren: TableCellDocPart[] = [];
    console.log(elem.childElementCount)
    if (elem.childElementCount > 1) {
      for (const childElem of elem.children) {
        const nodeName = childElem.nodeName.toLowerCase();
        // console.log(nodeName);
        switch (nodeName) {
          case "p":
            tableCellChildren.push(this.getParagraph(childElem));
            break;
          case "table":
            tableCellChildren.push(this.getTable(childElem));
            break;
          default:
            console.log("Unhandled " + elem.nodeName.toLowerCase() + " child element: " + nodeName);
        }
      }
    } else {
      // console.log(elem.children)
      tableCellChildren.push(this.getParagraph(elem));
    }
    const tableCellOptions: ITableCellOptions = {
      shading: {
        fill: background,
        color: color
      },
      margins: {
        top: 1,
        bottom: 1,
        left: 1,
        right: 1,
      },
      verticalAlign: VerticalAlign.CENTER,
      textDirection: TextDirection.LEFT_TO_RIGHT_TOP_TO_BOTTOM,
      width: {
        size: width,
        type: WidthType.DXA,
      },
      columnSpan: span = 0 ? 1 : span,
      /*
        rowSpan: 1,
        borders: {
            top: {
                style: BorderStyle.SINGLE,
                size: 1,
                color: "green"
            },
            bottom: {
                style: BorderStyle.SINGLE,
                size: 1,
                color: "blue"
            },
            left: {
                style: BorderStyle.SINGLE,
                size: 1,
                color: "yellow"
            },
            right: {
                style: BorderStyle.SINGLE,
                size: 1,
                color: "pink"
            }
        },
        */
      children: tableCellChildren,
    };
    const tableCell = new TableCell(tableCellOptions);
    return tableCell;
  }

  public getRunOptions(child: string | ParagraphDocPart[],
    color: string,
    doBold: boolean|undefined,
    doItalics: boolean|undefined,
    doEmphasis: boolean,
    doStrikeThru: boolean,
    doUnderline: boolean): IRunOptions {
      if (typeof child === "string") {
      const txt = child as string;
      if (doUnderline) {
        const textRunOptions: IRunOptions = {
          text: txt,
          color: color,
          bold: doBold,
          italics: doItalics,
          strike: doStrikeThru,
          underline: {
              type: UnderlineType.SINGLE
          }
        };
        return textRunOptions;
      }
      else {
        const textRunOptions: IRunOptions = {
          text: txt,
          color: color,
          bold: doBold,
          italics: doItalics,
          strike: doStrikeThru,
        };
        return textRunOptions;
      }
    }
    else {
      const childPhrasingParts = child as ParagraphDocPart[];
      if (doUnderline) {
        const textRunOptions: IRunOptions = {
          children: childPhrasingParts,
          bold: doBold,
          italics: doItalics,
          color: color,
          strike: doStrikeThru,
          underline: {
            type: UnderlineType.SINGLE,
          },
        };
        return textRunOptions;
      }
      else {
        const textRunOptions: IRunOptions = {
          children: childPhrasingParts,
          bold: doBold,
          italics: doItalics,
          color: color,
          strike: doStrikeThru,
        };
        return textRunOptions;
      }
    }
  }

  public getParagraph(elem: Element): Paragraph {
    const style = this.getStyle(elem);
    let color = "black"
    let isBullet = false;
    let level: number = 0
    let nodeName = elem.nodeName.toLowerCase();
    if (nodeName === "li") {
      isBullet = true;
      level = this.getLevel(elem)
    }
    Object.keys(style).forEach((key) => {
      // console.log('getParagraph style attr - ' + key + ' = ' + style[key]);
      switch (key) {
        case "color":
          color = String(style[key]);
          if (color === "black") {
            color = "000000"
          }
          if (color === "white") {
            color = "ffffff"
          }
          if (color.indexOf("rgb") >= 0) {
            // convert rgb to hex without leading #
            color = this.rgb2hex(color)
          }
          break;
      }
    });
    // console.log('getParagraph style color ' + color);
    const align = this.getAlign(elem);
    const finalAlign = this.determineAlign(style, align);
    const alignmentType = this.getAlignmentType(finalAlign);
    const doUnderline = this.getUnderline(style);
    const doStrikeThru = this.getStrikeThru(style);
    const paragraphRunOptions = this.getRunOptions("", color, false, false, false, false, false);
    const paragraphChildren: ParagraphDocPart[] = [];
    for (const childNode of elem.childNodes) {
      nodeName = childNode.nodeName.toLowerCase();
      if (childNode.nodeType === Node.TEXT_NODE) {
        const txt = childNode.textContent;
        if (txt && txt.length > 0) {
          const textRunOptions = this.getRunOptions(txt, color, false, false, false, false, false);
          const textRun = new TextRun(textRunOptions);
          paragraphChildren.push(textRun);
        }
      }
      else {
        if (childNode instanceof Element) {
          const childElem = childNode as Element;
          this.pushAll(paragraphChildren, this.getPhrasing(paragraphRunOptions, childElem));
        }
        else {
            console.log("Unhandled node: " + nodeName);
        }
      }
    }
    let p = new Paragraph({})
    if (isBullet) {
      const paragraphOptions: IParagraphOptions = {
        children: paragraphChildren,
        alignment: alignmentType,
        bullet: {
          level: level
        },
        indent: {
          left: level * 200
        }
      };
      p = new Paragraph(paragraphOptions);
    } else {
      const paragraphOptions: IParagraphOptions = {
        children: paragraphChildren,
        alignment: alignmentType,
      };
      p = new Paragraph(paragraphOptions);
    }
    return p;
  }

  public getPhrasing(parentRunOptions: IRunOptions, elem: Element): ParagraphDocPart[] {
    const style = this.getStyle(elem);
    let color = "black"
    Object.keys(style).forEach((key) => {
      // console.log('getPhrasing style attr - ' + key + ' = ' + style[key]);
      switch (key) {
        case "color":
          color = String(style[key]);
          if (color === "black") {
            color = "000000"
          }
          if (color === "white") {
            color = "ffffff"
          }
          if (color.indexOf("rgb") >= 0) {
            // convert rgb to hex without leading #
            color = this.rgb2hex(color)
          }
          break;
      }
    });
    console.log('getPhrasing style color ' + color);
    const doUnderline = this.getUnderline(style);
    const doStrikeThru = this.getStrikeThru(style);
    const paragraphDocParts: ParagraphDocPart[] = [];
    const nodeName = elem.nodeName.toLowerCase();
    let doBold = parentRunOptions.bold;
    let doItalics = parentRunOptions.italics;
    let doEmphasis = false;
    switch (nodeName) {
      case "b":
        doBold = true;
        break;
      case "i":
        doItalics = true;
        break;
      case "em":
        doEmphasis = true;
        break;
      case "strong":
        doBold = true;
        doItalics = true;
        break;
      case "span":
        break;
      case "img":
        break;
      default:
        console.log("Unhandled phrasing element " + nodeName);
        return paragraphDocParts;
    }
    const myRunOptions = this.getRunOptions("", color, doBold, doItalics, doEmphasis, doStrikeThru, doUnderline);
    if (nodeName === "img") {
      const src = elem.getAttribute("src")!;
      const widthVal = elem.getAttribute("width");
      const heightVal = elem.getAttribute("height");
      let width = Number(widthVal);
      if (isNaN(width)) {
          width = 500;
      }
      let height = Number(heightVal);
      if (isNaN(height)) {
          height = 500;
      }
      const img = this.imgMap.get(src);
      if (img != null) {
        const dimensions = sizeOf.imageSize(img);
        const imgWidth = dimensions.width;
        const imgHeight = dimensions.height;
        // need to set width and then match appropriate height
        const newHeight = Math.floor((624*imgHeight!)/imgWidth!);
        const pictureRun = Media.addImage(this.wordDoc, img, 624, newHeight);
        paragraphDocParts.push(pictureRun);
      }
    }
    else {
      const childPhrasingParts: ParagraphDocPart[] = [];
      for (const childNode of elem.childNodes) {
        const childNodeName = childNode.nodeName.toLowerCase();
        if (childNode.nodeType === Node.TEXT_NODE) {
          const txt = childNode.textContent;
          if (txt != null) {
            const textRunOptions = this.getRunOptions(txt, color, doBold, doItalics, doEmphasis, doStrikeThru, doUnderline);
            const textRun = new TextRun(textRunOptions);
            childPhrasingParts.push(new TextRun(textRunOptions));
          }
        }
        else {
          if (childNode instanceof Element) {
            const childElem = childNode as Element;
            this.pushAll(childPhrasingParts, this.getPhrasing(myRunOptions, childElem));
          }
          else {
            console.log("Unhandled node: " + nodeName);
          }
        }
      }
      const childRunOptions = this.getRunOptions(childPhrasingParts, color, doBold, doItalics, doEmphasis, doStrikeThru, doUnderline);
      const myTextRun: TextRun = new TextRun(childRunOptions);
      paragraphDocParts.push(myTextRun);
    }
    return paragraphDocParts;
  }

  public getText(elem: Element): string|null {
    let resultText: string|null = null;
    for (const childNode of elem.childNodes) {
      const nodeName = childNode.nodeName.toLowerCase();
      if (childNode.nodeType === Node.TEXT_NODE) {
        resultText = childNode.textContent;
      }
    }
    return resultText;
  }

  public getUnderline(style: object): boolean {
    let textDecoration = style["text-decoration-line"];
    if (textDecoration && textDecoration != null) {
      if (textDecoration.includes("underline")) {
        return true;
      }
    }
    textDecoration = style["text-decoration"];
    if (textDecoration && textDecoration != null) {
      if (textDecoration.includes("underline")) {
        return true;
      }
    }
    return false;
  }

  public getStrikeThru(style: object): boolean {
    let textDecoration = style["text-decoration-line"];
    if (textDecoration && textDecoration !== null) {
      if (textDecoration.includes("line-through")) {
        return true;
      }
    }
    textDecoration = style["text-decoration"];
    if (textDecoration && textDecoration !== null) {
      if (textDecoration.includes("line-through")) {
        return true;
      }
    }
    return false;
  }

  public determineAlign(style: object, align: string): string {
    let finalAlign = "left";
    const tmpAlign = style["text-align"];
    if (tmpAlign && tmpAlign != null) {
      finalAlign = tmpAlign;
    }
    else if (align) {
      finalAlign = align;
    }
    return finalAlign;
  }

  public getAlignmentType(align: string): AlignmentType {
    let alignmentType = AlignmentType.LEFT;
    switch (align) {
      case "left":
        alignmentType = AlignmentType.LEFT;
        break;
      case "right":
        alignmentType = AlignmentType.RIGHT;
        break;
      case "center":
        alignmentType = AlignmentType.CENTER;
        break;
      case "justify":
        alignmentType = AlignmentType.JUSTIFIED;
        break;
      case "start":
        alignmentType = AlignmentType.START;
        break;
      case "end":
        alignmentType = AlignmentType.END;
        break;
      default:
        alignmentType = AlignmentType.LEFT;
        break;
    }
    return alignmentType;
  }

  public getAlign(elem: Element): string {
    let align = 'left';
    for (const attr of elem.attributes) {
      if (attr.nodeName === "align") {
        const tmpAlign = attr.nodeValue;
        if (tmpAlign != null) {
            align = tmpAlign;
        }
        break;
      }
    }
    return align;
  }

  public getStyle(elem: Element): {} {
    try {
      let style = {};
      for (const attr of elem.attributes) {
        if (attr.nodeName === "style") {
          style = styleAttr.parse(attr.nodeValue);
          break;
        }
      }
      return style;
    } catch (e) {
        return ''
    }
  }

  public getLevel(elem: Element): number {
    try {
      const l = Number(elem.getAttribute("level"))
      return l;
    } catch (e) {
        return 0
    }
  }

  public rgb2hex(rgb: any): string {
    const sep = rgb.indexOf(",") > -1 ? "," : " ";
    // tslint:disable-next-line: no-parameter-reassignment
    rgb = rgb.substr(4).split(")")[0].split(sep);

    let r = (+rgb[0]).toString(16);
    let g = (+rgb[1]).toString(16);
    let b = (+rgb[2]).toString(16);

    if (r.length === 1) { 
      r = "0" + r;
    }
    if (g.length === 1) {
      g = "0" + g;
    }
    if (b.length === 1) {
      b = "0" + b;
    }
    const s = r + g + b
    console.log("rgb2hex: " + rgb + " = " + s)
    return s;
   }
}