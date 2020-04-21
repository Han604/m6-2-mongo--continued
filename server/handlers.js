'use strict';

const { MongoClient } = require('mongodb')
const assert = require('assert')

const updateSeat = async (req, res) => {
    const { seatId, creditCard, expiration, fullName, email } = req.body;
    console.log(seatId)

    if (!creditCard || !expiration) {
        return res.status(400).json({
            status: 400,
            message: 'Please provide credit card information!',
        });
    }

    const client = new MongoClient('mongodb://localhost:27017', {
        useUnifiedTopology: true,
    })

    await client.connect();
    const db = client.db('seatingDB');

    try {
        const r = await db.collection('userInfo').insertOne({name: fullName, email: email});
        assert.equal(1, r.insertedCount);
        res.status(201).json({ status: 201, data: {name: fullName, email: email} });
    } catch (err) {
        console.log(err.stack) 
        res.status(500).json({ status:500, data: {name: fullName, email: email}, message: err.message });
    }

    const query = { _id: seatId };
    const newValue = { $set: { isBooked: true } }
    try {
        const r = await db.collection('seats').updateOne(query, newValue);
        assert.equal(1, r.modifiedCount);
        res.status(200).json({status: 200, seatId });
    } catch (err) {
        console.log(err.stack)
    }
    client.close()
}
const getSeats = async (req, res) => {
    const client = new MongoClient('mongodb://localhost:27017', {
        useUnifiedTopology: true,
    }); 

    await client.connect();
    const db = client.db('seatingDB')

    await db.collection('seats')
    .find()
    .toArray((err, result) => {
        const data = {};
        
        result.forEach(o => {
            const {_id} = o;
            data[_id] = {price: o.price, isBooked: o.isBooked}
        })
        result
            ? res.status(200).json({ status: 200, seats: data, numOfRows: 8, seatsPerRow: 12  })
            : res.status(404).json({ status: 404, data: 'Not Found' });
        client.close()
    })
};

const batchImport = async (data) => {
    console.log(data)

    const client = new MongoClient('mongodb://localhost:27017', {
        useUnifiedTopology: true,
    });
    
    try {
        await client.connect();
        
        const db = client.db('seatingDB');        
        const r = await db.collection('seats').insertMany(data);
        assert.equal(data.length, r.insertedCount);
        console.log('success');
    } catch (err) {
        console.log(err.stack);
    }
    client.close();
}


module.exports = { getSeats, batchImport, updateSeat };