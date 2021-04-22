const Service = require("../../model/service/service.model");
const Merchant = require("../../model/auth/merchant.model");
const Booking = require("../../model/service/booking.model");
const Appointment = require("../../model/service/appointment.model");
const checkAuth = require("../../middleware/auth-check");
const email = require("../common/mail");
const Spreport = require("./sp-report");

//dependency imports
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");

//express app declaration
const serviceProvider = express();

// multer setup for image upload
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif'
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Image");
    if (isValid) {
      error = null;
    }
    cb(error, "images/merchant");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});


//middleware
serviceProvider.use(bodyParser.json());
serviceProvider.use(bodyParser.urlencoded({ extended: false }));


// add serviceProvider photos
serviceProvider.post('/add/img', checkAuth, multer({ storage: storage }).array("images[]"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  let imagePaths = [];
  for (let f of req.files) {
    imagePaths.push(url + "/images/merchant/" + f.filename);
  }
  res.status(200).json({
    imagePaths: imagePaths
  });

});


// get methods

//get list of bookings
serviceProvider.get('/booking/get', checkAuth, (req, res, next) => {
  Booking.find({ 'serviceProvider.serviceProvider_id': req.userData.user_id }, function (err, bookings) {
    console.log(bookings);
    if (err) return handleError(err => {
      res.status(500).json(
        { message: 'No bookings Found!' }
      );
    });
    res.status(200).json(
      {
        message: 'booking list recieved successfully!',
        bookings: bookings
      }
    );
  });
});


//get list of appointments
serviceProvider.get('/appoint/get', checkAuth, (req, res, next) => {
  Appointment.find({ 'serviceProvider.serviceProvider_id': req.userData.user_id }, function (err, appointments) {
    console.log(appointments);
    if (err) return handleError(err => {
      res.status(500).json(
        { message: 'No Appointments Found!' }
      );
    });
    res.status(200).json(
      {
        message: 'appoitment list recieved successfully!',
        appointments: appointments
      }
    );
  });
});


//get selected booking
serviceProvider.get('/booking/get/:id', checkAuth, (req, res, next) => {

  Booking.findOne({ 'booking_id': req.params.id }, function (err, recievedBooking) {
    if (err) return handleError(err => {
      console.log(err);
      res.status(500).json(
        { message: 'Error while loading Booking Details! Please Retry!' }
      );
    });
    console.log(recievedBooking);
    res.status(200).json(
      {
        message: 'Booking recieved successfully!',
        booking: recievedBooking
      }
    );
  });
});

//get selected appointment
serviceProvider.get('/appoint/get/:id', checkAuth, (req, res, next) => {

  Appointment.findOne({ 'appoint_id': req.params.id }, function (err, recievedAppoint) {
    if (err) return handleError(err => {
      console.log(err);
      res.status(500).json(
        { message: 'Error while loading Appointment Details! Please Retry!' }
      );
    });
    console.log(recievedAppoint);
    res.status(200).json(
      {
        message: 'Appointment recieved successfully!',
        appointment: recievedAppoint
      }
    );
  });
});

//get calendar bookings
serviceProvider.get('/calbooking/get', checkAuth, (req, res, next) => {
  Booking.find({ 'serviceProvider.serviceProvider_id': req.userData.user_id, 'state': { $ne: 'cancelled' } }, function (err, recievedBookings) {
    if (err) return handleError(err => {
      console.log(err);
      res.status(500).json(
        { message: 'Error while loading Calendar Booking Details! Please Retry!' }
      );
    });
    console.log(recievedBookings);
    res.status(200).json(
      {
        message: 'Appointment recieved successfully!',
        bookings: recievedBookings
      }
    );
  });
});



//get dashboard stats
serviceProvider.get('/stat/get', checkAuth, (req, res, next) => {

  var bookingQuery = Booking.find({ 'serviceProvider.serviceProvider_id': req.userData.user_id }).select('booking_id service_id service_name created_date state amount amount_paid');
  var appointQuery = Appointment.find({ 'serviceProvider.serviceProvider_id': req.userData.user_id }).select('appoint_id service_id service_name created_date state');

  bookingQuery.exec().then((resBooks) => {
    console.log(resBooks);
    appointQuery.exec().then((resAppoints) => {
      console.log(resAppoints);
      res.status(200).json(
        {
          message: 'Report Data recieved successfully!',
          bookings: resBooks,
          appoints: resAppoints
        });
    })

  }).catch(err => {
    console.log(err);
  })
});


//get service provider names list for report queries
serviceProvider.get('/get/spnames', checkAuth, (req, res, next) => {

  var query = Service.find({ user_id: req.userData.user_id }).select('service_name service_id');

  query.exec().then((resBooks) => {
    console.log(resBooks);
    res.status(200).json(
      {
        message: 'Report Data recieved successfully!',
        spnames: resBooks
      });
  }).catch(err => {
    console.log(err);
  })
});


//get service provider names list for report queries
serviceProvider.get('/get/spid', checkAuth, (req, res, next) => {
    res.status(200).json(
      {
        id: req.userData.user_id
      });
  });





// post methods

//update booking state
serviceProvider.post('/booking/edit', checkAuth, (req, res, next) => {

  Booking.findOneAndUpdate({ 'booking_id': req.body.bookingId }, { 'state': req.body.state }, function (err, recievedBooking) {
    if (err) return handleError(err => {
      console.log(err);
      res.status(500).json(
        { message: 'Error while updating Booking State! Please Retry!' }
      );
    });
    console.log(recievedBooking);
    res.status(200).json(
      {
        message: 'Booking state updated successfully!',
        booking: recievedBooking
      }
    );
  });
});


//update appointment state
serviceProvider.post('/appoint/edit', checkAuth, (req, res, next) => {

  Appointment.findOneAndUpdate({ 'appoint_id': req.body.appointId }, { 'state': req.body.state }, function (err, recievedAppoint) {
    if (err) return handleError(err => {
      console.log(err);
      res.status(500).json(
        { message: 'Error while updating Appointment State! Please Retry!' }
      );
    });
    console.log(recievedAppoint);
    res.status(200).json(
      {
        message: 'Appointment state updated successfully!',
        appointment: recievedAppoint
      }
    );
  });
});




// send an  email
serviceProvider.post("/mail", checkAuth, (req, res, next) => {
  let mail = req.body;
  mail.email = req.userData.email;
  console.log(mail);
  email.sendMail(mail, info => {
    res.status(200).json(
      {
        message: 'mail sent successfully!',
        info: info
      }
    );
  }).catch(err => {
    console.log(err);
    res.status(500).json(
      {
        message: 'mail sending failed!',
      }
    );
  })
});

serviceProvider.use('/reports', Spreport);


module.exports = serviceProvider;
