/** Rich text annotation from Notion */
export interface RichTextAnnotation {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  color: string;
}

/** A single rich text span within a block */
export interface RichTextSpan {
  text: string;
  annotations: RichTextAnnotation;
  href?: string;
}

/** A parsed Notion block for SOW rendering */
export interface SOWBlock {
  type:
    | 'heading_1'
    | 'heading_2'
    | 'heading_3'
    | 'paragraph'
    | 'bulleted_list_item'
    | 'numbered_list_item'
    | 'divider'
    | 'toggle'
    | 'callout'
    | 'quote'
    | 'table';
  richText: RichTextSpan[];
  children?: SOWBlock[];
  /** For table blocks: array of rows, each row is array of RichTextSpan[] */
  tableRows?: RichTextSpan[][][];
}

/** Contract data extracted from Notion relations */
export interface SOWContractData {
  notionPageId: string;
  // Contract properties
  title: string;
  status: string;
  dealAmount: string;
  paymentStructure: string;
  docType: string;
  documentDate: string;
  // Deal relation
  dealName: string;
  eventDate: string;
  eventType: string;
  dealValue: string;
  services: string;
  deliverables: string;
  attire: string;
  licensing: string;
  // Contact relation
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  // Account relation
  accountName: string;
  accountWebsite: string;
  // Product/Service relations
  products: Array<{
    name: string;
    price: string;
    description: string;
  }>;
  // Page content
  blocks: SOWBlock[];
}
