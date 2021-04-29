
export interface Scraper {
  scraperId: string;
  scraperName: string;
  description: string;
  tags: string[];
  baseURL: string;
  scraperLocation: string;
  script: string;
  updaterMode: boolean,
  updaterScript: string,
  params: {
    categories: string[];
    locations: string[];
  };
  price: number;
}

export interface ScraperRun {
  scraperRunId: string;
  timestamp: number;
  noOfRuns: number;
  noOfCols: number;
  noOfRows: number;
  executionType: string, // scraper, updater
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
  scrapers: UserScraper[];
}

export interface UserScraper {
  scraperId: string;
  scraperName: string;
  status: string;
  scraperRuns: ScraperRun[];
}

export interface DashStat {
  registeredUsers : number;
  totlaScraperRuns: number;
  totalScrapers: number;
}

export interface DateObj {
  date: number;
  month: number;
  year: number;
}

export interface ResultUpdated {
  result: string;
  scraperRunId: string;
  status: boolean;
}

export interface CreateRunItem {
  scraperId: string;
  scraperRunId: string;
  dataLocation: string,
  dataFormat: string,
  executionType: string,
  executedCategories: string[],
  executedLocations: string[],
  status: boolean;
}
