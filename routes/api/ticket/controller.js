const _ = require("lodash");
const { Ticket } = require("../../../models/Ticket")
const { Trip } = require("../../../models/Trip")
const { Seat } = require("../../../models/Seat");
const { sendBookTicketEmail } = require("../../../email/bookingTicket")

// create ticket = book ticket
module.exports.createTicket = (req, res, next) => {
  const { tripId, seatCodes } = req.body;
  // seatCodes = ['A01', 'A02', 'A03']
  Trip.findById(tripId)
    .populate("fromStationId")
    .populate("toStationId")
    .then(trip => {
      if (!trip) return Promise.reject({ message: "Trip not found" })

      // ['A01', 'A04', 'A05',....]
      const availableSeatCodes = trip.seats
        .filter(s => !s.isBooked)
        .map(s => s.code)

      // ['A02', 'A03']
      // const errSeatCodes = [];
      // seatCodes.forEach(s => {
      //   if (availableSeatCodes.indexOf(s) === -1) {
      //     errSeatCodes.push(s)
      //   }
      // })

      const errSeatCodes = seatCodes.filter(s => {
        // if (availableSeatCodes.indexOf(s) === -1) return true
        return availableSeatCodes.indexOf(s) === -1
      })

      // const errSeatCodes = seatCodes.map(s => {
      //   if (availableSeatCodes.indexOf(s) === -1) return s
      // })

      if (!_.isEmpty(errSeatCodes)) return Promise.reject({
        message: `Seat(s) ${errSeatCodes.join(", ")} are already booked`,
        errSeatCodes
      })

      const newTicket = new Ticket({
        tripId,
        userId: req.user._id,
        seats: seatCodes.map(code => new Seat({ code, isBooked: true })),
        totalPrice: seatCodes.length * trip.price
      })

      seatCodes.forEach(code => {
        const index = trip.seats.findIndex(s => s.code === code)
        trip.seats[index].isBooked = true;
      })

      return Promise.all([
        newTicket.save(),
        trip.save()
      ])
    })
    .then(result => {
      sendBookTicketEmail(result[0], result[1], req.user);
      res.status(200).json(result[0])
    })
    .catch(err => res.json(err))
}