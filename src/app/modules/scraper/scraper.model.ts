
export interface Scraper {
  scraperId: string;
  scraperName: string;
  description: string;
  tags: string[];
  baseURL: string;
  scraperLocation: string;
  script: string;
  params: {
    categories: string[];
    locations: string[];
  };
  price: number;
}

export interface ScraperRun {
  scraperRunId: string;
  userId: string;
  scraperId: string;
  timestamp: number;
  noOfRuns: number;
  noOfCols: number;
  noOfRows: number;
  executed_params:{
    categories: string[];
    locations: string[];
  };
  dataLocation: string;
  dataFormat: string;
  status: string;
}


export interface User {
  userId: string;
  userName: string;
  userType: string;
  profilePic: string;
  userEmail: string;
  userContactNo: string;
  status: string;
}

export interface DashStat {
  registeredVehicles : number;
  registeredPassengers: number;
  monthlyIncome: number;
}

export interface DateObj {
  date: number;
  month: number;
  year: number;
}

export interface LegalDocument {
  front: string;
  back: string;
}

