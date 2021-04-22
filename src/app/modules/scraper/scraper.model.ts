
export interface Admin {
  userId: string;
  userName: string;
  userType: string;
  profilePic: string;
  userEmail: string;
  userContactNo: string;
  gender: string;
}

export interface DashStat {
  registeredVehicles : number;
  registeredPassengers: number;
  monthlyIncome: number;
}

export interface Payment {
  payId: string;
  driverId: string;
  driverName: string;
  driverContactNo: string;
  vehicleNo: string;
  status: string;
  payDate: DateObj;
  payAmount: number;
  serviceCharge: number;
  passengerId: string;
  passengerName: string;
  passengerContactNo: string;
}

export interface Income {
  payId: string;
  driverId: string;
  driverName: string;
  status: string;
  payDate: DateObj;
  payAmount: number;
  passengerId: string;
  passengerName: string;
  reason: string; 
}

export interface Passenger {
  passengerId: string;
  passengerName: string;
  passengerContactNo: string; 
  passengerEmail: string;
  profilePic: string;
  pickup: string;
  dropoff: string;
  passengerRegDate: string;
  status: string;
}

export interface Driver {
  driverId: string;
  driverName: string;
  driverContactNo: string; 
  driverEmail: string;
  profilePic: string;
  pickup: string;
  dropoff: string;
  driverRegDate: string;
  vehicleNo: string;
  vehicleType: string;
  noOfSeats: number;
  availableSeats: number;
  ACType: string;
  vehiclePhotos: VehiclePhotos;
  NICPhotos: LegalDocument;
  driverLicensePhotos: LegalDocument;
  revenueLicensePhotos: LegalDocument;
  insurrencePhotos: LegalDocument
  bankBookPhoto: string;
  status: string;
}

export interface DuePayment {
  payId: string;
  driverId: string;
  driverName: string;
  passengerId: string;
  passengerName: string;
  driverProfilePic: string;
  passengerProfilePic: string;
  passengerContactNo: string;
  driverContactNo: string; 
  dueDate: DateObj;
  dueAmount: number;
  monthlyPayment: number;
  pickup: string;
  dropoff: string;
  paymentStatus: string;
}

export interface DateObj {
  date: number;
  month: number;
  year: number;
}

export interface VehiclePhotos {
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  image5: string;
  image6: string;
}

export interface LegalDocument {
  front: string;
  back: string;
}