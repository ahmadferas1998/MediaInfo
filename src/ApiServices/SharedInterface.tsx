
interface BoundingBox {
    x: number;
    y: number;
  }
  
  interface Line {
    boundingBox: BoundingBox[];
    text: string;
  }
  
  interface Word {
    boundingBox: BoundingBox[];
    text: string;
  }
  
  interface LayoutText {
    language: string;
    text: string;
    lines: Line[];
    words: Word[];
  }
  
  interface Document {
    "@search.score": number;
    content: string;
    metadata_storage_content_type: string;
    metadata_storage_size: number;
    metadata_storage_last_modified: string;
    metadata_storage_content_md5: string;
    metadata_storage_name: string;
    metadata_storage_path: string;
    metadata_storage_file_extension: string;
    metadata_content_type: string;
    people: string[];
    organizations: string[];
    locations: string[];
    keyphrases: string[];
    language: string;
    translated_text: string;
    masked_text: string;
    merged_content: string;
    text: string[];
    layoutText: LayoutText[];
  }
  
  export interface SearchResult {
    "@odata.context": string;
    value: Document[];
  }

export const BasicUrlContent="https://sq1kmstorageaccount.blob.core.windows.net/km-insight/"

  