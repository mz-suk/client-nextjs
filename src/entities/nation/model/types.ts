export interface Nation {
  alp3NatnCode: string;
  alp2NatnCode: string;
  natnIntcNo: string;
  natnNm: string;
  abrv: string;
}

export interface NationSearchParams {
  keyword?: string;
}

export interface NationListParams {
  keyword?: string;
}
