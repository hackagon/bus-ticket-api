const { Trip } = require("../../../models/Trip");
const { Seat } = require("../../../models/Seat");
const seatCodes = [
  "A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08", "A09", "A010", "A11", "A12",
  "B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B09", "B010", "B11", "B12"
]

module.exports.getTrips = (req, res, next) => {
  Trip.find()
    .populate("fromStationId")
    .populate("toStationId")
    // .select("-seats")
    .then(trips => res.status(200).json(trips))
    .catch(err => res.status(500).json(err))
}

module.exports.getTripById = (req, res, next) => {
  const { id } = req.params;
  Trip.findById()
    .populate("fromStationId")
    .populate("toStationId")
    .then(trip => res.status(200).json(trip))
    .catch(err => res.status(500).json(err))
}

module.exports.createTrip = (req, res, next) => {
  const { fromStationId, toStationId, startTime, price } = req.body;
  // const seats = [];
  // seatCodes.forEach(code => {
  //   const newSeat = new Seat({ code: code })
  //   seats.push(newSeat)
  // })
  const seats = seatCodes.map(code => new Seat({ code }))
  console.log("module.exports.createTrip -> seats", seats)

  const newTrip = new Trip({
    fromStationId, toStationId, startTime, price, seats
  })
  newTrip.save()
    .then(trip => res.status(201).json(trip))
    .catch(err => res.status(500).json(err))
}

module.exports.replaceTripById = (req, res, next) => {

}

module.exports.updateTripById = (req, res, next) => {

}

module.exports.deleteById = (req, res, next) => {

}