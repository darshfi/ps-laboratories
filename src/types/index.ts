export interface CatalogProduct {
  id: string;
  name: string;
  cas_no: string;
  synonyms_iupac: string;
}

export interface EnquiryItem {
  product: CatalogProduct;
  quantity: string;
}

export interface CompanyInfo {
  legalName: string;
  tradeName: string;
  tagline: string;
  founded: string;
  address: {
    line1: string;
    line2: string;
    country: string;
  };
  contact: {
    phones: string[];
    email: string;
  };
  registrations: {
    gstin: string;
    udyamNumber: string;
    udyamCategory: string;
    isoCertificate: {
      standard: string;
      certNo: string;
      issueDate: string;
      expiryDate: string;
      note: string;
    };
  };
  about: string;
  mission: string;
  vision: string;
  expertiseAreas: ExpertiseArea[];
  whyChooseUs: string[];
  enquiryChecklist: string[];
}

export interface ExpertiseArea {
  title: string;
  description: string;
}
