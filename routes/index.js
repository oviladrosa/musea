const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
// db.once('open', () => console.log('Connected to Mongoose'))

router.get('/', (req, res) => {
  res.render('index')
})

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const MuseumSchema = new Schema({
  _id: ObjectId,
  name: String,
  address: String,
  city: String,
  country: String,
  location: Array,
  expositions: Array,
  descriptions: Object,
  image: String
})
const Model = mongoose.model
const Museum = Model('museums', MuseumSchema) // first parameter is the name of the collection

const ExpositionSchema = new Schema({
  _id: ObjectId,
  name: String,
  room: String,
  descriptions: Object,
  works: Array,
  image: String
})
const Exposition = Model('expositions', ExpositionSchema)

const WorkSchema = new Schema({
  _id: ObjectId,
  title: String,
  author: String,
  descriptions: Object,
  score: Number,
  type: String,
  image: String
})
const Work = Model('artworks', WorkSchema)

router.get('/museums', (req, res) => {
  // eslint-disable-next-line array-callback-return
  Museum.find((err, docs) => {
    if (err) console.log(err)
    res.json({ museums: docs })
  })
})

router.get('/museums/:museumId', (req, res) => {
  const id = req.params.museumId
  // eslint-disable-next-line array-callback-return
  Museum.findById(id, (err, doc) => {
    if (err) console.log(err)
    let expoId
    const result = {
      _id: doc._id,
      name: doc.name,
      address: doc.address,
      city: doc.city,
      country: doc.country,
      location: doc.location,
      expositions: [],
      descriptions: doc.descriptions,
      image: doc.image
    }
    for (let i = 0; i < doc.expositions.length; i++) {
      expoId = doc.expositions[i]
      Exposition.findById(expoId, (error, expo) => {
        if (error) console.log(error)
        result.expositions.push(expo)
        if (i === result.expositions.length - 1) res.json({ museum: result })
      })
    }
  })
})

router.get('/museums/:museumId/:expositionId', (req, res) => {
  const id = req.params.expositionId
  // eslint-disable-next-line array-callback-return
  Exposition.findById(id, (err, doc) => {
    if (err) console.log(err)
    let artworkId
    const result = {
      _id: doc._id,
      name: doc.name,
      room: doc.room,
      descriptions: doc.descriptions,
      works: [],
      image: doc.image
    }
    for (let i = 0; i < doc.works.length; i++) {
      artworkId = doc.works[i]
      Work.findById(artworkId, (error, work) => {
        if (error) console.log(error)
        result.works.push(work)
        if (i === result.works.length - 1) res.json({ museum: result })
      })
    }
  })
})

router.get('/museums/:museumId/:expositionId/:workId', (req, res) => {
  const id = req.params.workId
  // eslint-disable-next-line array-callback-return
  Work.findById(id, (err, doc) => {
    if (err) console.log(err)
    res.json({ work: doc })
  })
})

module.exports = router
