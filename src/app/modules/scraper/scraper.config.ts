const url: string = "http://localhost:3000/web-scraper/v1/";

const getDashStat = "dash-counts";
const getScraperPayments = "payment/scraper/"; // scraperId
const getUserPayments = "payment/user"; // userId
const getScraper = "scraper/one/"; // scraperId
const getAllScrapers = "scraper/all"
const getLastScraperId = "scraper/last-id"
const getUserScrapers = "scraper/user"; // userId
const getUserScraperStatus = "scraper/status/"; //scraperId,  userId
const getScraperRun = "scraper/run/one"; // userId
const getUserScraperRuns = "scraper/run/user"; // userId
const getScrapedJSONData = "scraper/json" // data location

const postDownloadCSV = "scraper/csv/download" // data location

const getUser = 'auth/user/one'; // userId
const getAuthUser = 'auth/user/current'; // userId
const getUsers = "auth/user/all";
const getHeader =  'auth/header';
const getLastId = 'auth/last-id';

const postSignIn = 'auth/signin';
const postSignUp = 'auth/signup';
const postUploadImage = 'auth/user/image'
const putUpdateUser = 'auth/user/one'; // current userId
const putUpdateSelectedUser = 'auth/user/selected'; // current userId
const putUpdateScraper = 'scraper/one/'; // scraperId
const postAddScraper = 'scraper/add';
const postUpdateUserScraperStatus = 'scraper/status'; // scraperId
const postCreateScraperRunEntry = 'scraper/create-run'; // scraperId

const postRunScraper = 'scraper/exec';
const postRunUpdater = 'scraper/exec-update';
const postScheduleScraper = 'scraper/schedule';
const getTerminateScraper = 'scraper/terminate/'; // userId, scraperId
const deleteScraper = 'scraper/one/'; // scraperRunId
const deleteScraperRun = 'scraper/run/one/'; // scraperId and scraperRunId
const deleteUser = "auth/user/one/" // given userId

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
  getUserScraperStatus,
  getScrapedJSONData,
  getLastScraperId,
  getHeader,
  getLastId,
  postSignIn,
  postSignUp,
  postUploadImage,
  putUpdateUser,
  putUpdateScraper,
  putUpdateSelectedUser,
  postScheduleScraper,
  postAddScraper,
  postRunScraper,
  postUpdateUserScraperStatus,
  postCreateScraperRunEntry,
  getTerminateScraper,
  postDownloadCSV,
  postRunUpdater,
  deleteScraper,
  deleteScraperRun,
  deleteUser
};
