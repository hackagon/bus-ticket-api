const { Station } = require("../../../models/Station");

module.exports.getStations = (req, res, next) => { // req: request, res: response, next
  Station.find()
    .then(stations => res.status(200).json(stations))
    .catch(err => res.status(500).json(err))
}

module.exports.getStationById = (req, res, next) => {
  const { id } = req.params;
  Station.findById(id)
    .then(station => {
      if (!station) return Promise.reject({ message: "Station not found" })

      res.status(200).json(station)
    })
    .catch(err => res.json(err))
}

module.exports.createStation = (req, res, next) => {
  const { name, address, province } = req.body;
  Station.create({
    name, address, province
  })
    .then(station => res.status(201).json(station))
    .catch(err => res.status(500).json(err))
}

// PUT
module.exports.replaceStationById = (req, res, next) => {
  const { id } = req.params;
  const { name, address, province } = req.body;
  Station.findById(id)
    .then(station => {
      if (!station) return Promise.reject({ message: "Station not found" })

      station.name = name
      station.address = address
      station.province = province

      return station.save()
    })
    .then(station => res.status(200).json(station))
    .catch(err => res.json(err))
}

// PATCH
module.exports.updateStationById = (req, res, next) => {
  const { id } = req.params;
  // const { name, address, province } = req.body;
  Station.findById(id)
    .then(station => {
      if (!station) return Promise.reject({ message: "Station not found" })

      // if (name) station.name = name
      // if (address) station.adedrss = address
      // if (province) station.province = province
      Object.keys(req.body).forEach(key => station[key] = req.body[key]);

      return station.save()
    })
    .then(station => res.status(200).json(station))
    .catch(err => res.json(err))
}

module.exports.deleteStationById = (req, res, next) => {
  const { id } = req.params;
  Station.deleteOne({ _id: id })
    .then(() => res.status(200).json({ message: "Delete successfully" }))
    .catch(err => res.json(err))
}
