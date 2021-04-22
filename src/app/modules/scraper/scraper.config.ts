const url: string = "http://localhost:3000/admin-dashboard/v1/";

const getAdmin = "users/self";
const getAdmins = "users/all";
const getDashStat = "dash-counts";
const duePayments = "due-payments";
const duePayment = "due-payment";
const getDriverPayments = "payments/driver";
const getPassengerPayments = "payments/passenger";
const getIncomes = "incomes";
const newDrivers = "new-drivers";
const getDrivers = "drivers";
const getPassengers = "passengers";

const getAuthAdmin = 'auth/get/admin';
const getHeader =  'auth/get/header';
const getLastId = 'auth/last';
const getSignIn = 'auth/signin';

export {url, getAdmin, getDashStat, duePayments, getDriverPayments, getPassengerPayments, duePayment, newDrivers, getPassengers, getDrivers, getAdmins, getIncomes, getAuthAdmin, getHeader, getLastId, getSignIn};