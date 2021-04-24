const url: string = "http://localhost:3000/web-scraper/v1/";

const getDashStat = "dash-counts";
const getScraperPayments = "payment/scraper/"; // scraperId
const getUserPayments = "payment/user/"; // userId
const getScraper = "scraper/one/"; // scraperId
const getAllScrapers = "scraper/all"
const getUserScrapers = "scraper/user/"; // userId
const getScraperRun = "scraper-run/one/"; // userId
const getUserScraperRuns = "scraper-run/user/"; // userId

const getUser = 'auth/user/one'; // userId
const getAuthUser = 'auth/user/current'; // userId
const getUsers = "auth/user/all";
const getHeader =  'auth/header';
const getLastId = 'auth/last-id';

const postSignIn = 'auth/signin';
const postSignUp = 'auth/signup';
const putUpdateUser = 'auth/user/one/'; // userId
const putUpdateScraper = 'scraper/one/'; // scraperId

const postRunScraper = 'scraper/run'; // userId, scraperId
const deleteScraper = 'scraper/one/'; // scraperRunId
const deleteScraperRun = 'scraper-run/one/'; // scraperRunId
const deleteUser = "auth/user/one/" // userId

export {
  url,
  getDashStat,
  getUser,
  getUsers,
  getAuthUser,
  getScraperPayments,
  getUserPayments,
  getScraper,
  getScraperRun,
  getAllScrapers,
  getUserScrapers,
  getUserScraperRuns,
  getHeader,
  getLastId,
  postSignIn,
  postSignUp,
  putUpdateUser,
  putUpdateScraper,
  postRunScraper,
  deleteScraper,
  deleteScraperRun,
  deleteUser
};
