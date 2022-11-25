const express = require('express');
const { Event } = require('../models/event');
const Invite = require('../models/invite');
const auth = require('../middleware/auth');
const router = new express.Router();

// Create Event
router.post('/events',auth,async(req,res)=>{
    const event = Event.build ({
        ...req.body,
        createdBy : req.user.id
    });
    try{
        await event.save();
        res.status(201).send(event);
    }catch(e){
        res.status(400).send(e);
    }
});

// Get Event and list of users for the event
router.get('/events/:id',auth,async (req,res)=>{
    const id = req.params.id; 
    try{
    const event = await Event.findAll({ where:{ id , createdBy: req.user.id }});
     if(event.length==0){
         return res.status(404).send()
     }
     const invite = await Invite.findAll({ where: { eventId: id }});
     let listOfUsers = [];
     if(invite.length != 0){
        invite.forEach((user)=>{
            listOfUsers.push(user.userId);
        })
     }
     res.send({event, listOfUsers});
    }catch(e){
     res.status(500).send();
    }
});

// Update Event
router.patch('/events/:id', auth ,async(req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ["eventName"];
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update));
    if(!isValidOperation){
        return res.status(400).send({ error : "Invalid Updates"});
    }
    
    try{
        const events = await Event.findAll({where:{id: req.params.id , createdBy: req.user.id}});
        if(events.length == 0){
            return res.status(404).send();
        }
        const event = events[0];
        
        updates.forEach((update)=> event[update] = req.body[update]);
        await event.save();    
        res.status(200).send(event);

    } catch(e){
        res.status(400).send(e);
    }

});

// Create Invite for an event
router.post('/events/:id/invite',auth,async(req,res)=>{
    const eventId = req.params.id;
    try{
    const event = await Event.findAll({ where:{ id: eventId , createdBy: req.user.id }});
     if(event.length==0){
         return res.status(404).send({error: 'Event Not Found'});
     }
     const user = req.body.user;
     let invite;
     if(req.body.user){
     invite = Invite.build({ eventId , userId:user})
     await invite.save();
     }
     res.send(invite);
    }catch(e){
    console.log(e);
     res.status(500).send();
    }
});


module.exports = router;