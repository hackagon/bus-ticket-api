const nodemailer = require('nodemailer');
const fs = require('fs'); // built-in NodeJS
const hogan = require("hogan.js");
const config = require("../config/index");

const template = fs.readFileSync(`${__dirname}/template/bookingTicket.hjs`, "utf-8");
const compiledTemplate = hogan.compile(template);

module.exports.sendBookTicketEmail = (ticket, trip, user) => {
  const transport = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    requireSSL: true,
    auth: {
      user: config.email,
      pass: config.password
    }
  }

  const transporter = nodemailer.createTransport(transport);

  const mailOptions = {
    from: config.email,
    to: user.email,
    subject: "Xác nhận mua vé thành công",
    html: compiledTemplate.render({
      email: user.email,
      fromStation: trip.fromStationId.name,
      toStation: trip.toStationId.name,
      price: trip.price,
      amount: ticket.seats.length,
      total: trip.price * ticket.seats.length,
      seatCodes: ticket.seats.map(s => s.code).join(" - ")
    })
  }

  transporter.sendMail(mailOptions, err => {
    if (err) return console.log(err.message)
    console.log("Send email success")
  })
}