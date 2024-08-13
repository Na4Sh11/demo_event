const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
const { sendPurchaseConfirmationEmail } = require('../util/emailUtils');

// Ping endpoint for server health check
exports.ping = (req, res) => {
  try {

    res.status(200).json({ message: 'Server is up and running!' });
  } catch (err) {
    console.error('Failed to ping server:', err);
    res.status(500).json({ error: 'Failed to ping server.' });
  }
};


exports.getAuthentication = (req, res) => {
  try {
    
    console.log('Request Headers:', req.headers);
    res.status(200).json({ message: 'Authentication is good!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to authenticate.' });
  }
};


// Sign Up
exports.signUp = async (req, res) => {
  const {auth0_id, email, name, password, organization } = req.body;
  
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = await prisma.user.create({
      data: {
        auth0_id,
        email,
        name,
        password: hashedPassword,
        organization,
      },
    });
    
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to sign up user.' });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    
    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log in user.' });
  }
};

// View User Details
exports.viewUser = async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await prisma.user.findUnique({
      where: { auth0_id: id },
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user details.' });
  }
};

// Update User Details
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, name, password, organization } = req.body;
  
  try {
    const updateData = {};
    
    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (organization) updateData.organization = organization;
    console.log("id in update backend "+id);
    const updatedUser = await prisma.user.update({
      where: { auth0_id: id },
      data: updateData,
    });

    console.log("id successful in update backend "+id);

    
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user.' });
  }
};

// Delete User Account
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  
  try {
    await prisma.user.delete({
      where: { auth0_id: id },
    });
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
};

/**
 * Add an event to the user's favorites.
 * @param {number} userId - The ID of the user.
 * @param {string|number} eventId - The ID of the event to add to favorites.
 * @returns {Promise<void>}
 */

exports.addEventToFavorites = async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    // Validate inputs
    if (typeof userId !== 'string' || typeof eventId !== 'string') {
      return res.status(400).json({ error: 'Invalid input' });
    }

    // Fetch the user to get current favorites
    const user = await prisma.user.findUnique({
      where: { auth0_id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Parse the favorites as an array
    console.log(user.favorites);
    // const favorites = user.favorites ? JSON.parse(user.favorites) : [];
    if (Array.isArray(user.favorites)) {
      // If `user.favorites` is already an array, use it directly
      favorites = user.favorites;
    } else if (user.favorites) {
      // If `user.favorites` is a valid JSON string, parse it
      try {
        favorites = JSON.parse(user.favorites);
      } catch (err) {
        return res.status(500).json({ message: 'Failed to parse favorites', error: err.message });
      }
    } else {
      // If `user.favorites` is null or undefined, start with an empty array
      favorites = [];
    }
    


    // Check if the event is already in favorites
    if (favorites.includes(eventId)) {
      return res.status(200).json({ message: 'Event is already in favorites' });
    }

    // Add the event to favorites
    favorites.push(eventId);

    // Update the user's favorites
    await prisma.user.update({
      where: { auth0_id: userId },
      data: { favorites: favorites },
    });

    return res.status(200).json({ message: 'Event added to favorites' });
  } catch (err) {
    console.error('Error adding event to favorites:', err);
    return res.status(500).json({ error: 'Failed to add event to favorites' });
  }
};

/**
 * Handle ticket purchase for an event by a user.
 * @param {Object} req - The request object containing user ID, event ID, and ticket count.
 * @param {Object} res - The response object for sending responses.
 */
exports.buyTickets = async (req, res) => {
  console.log(req.body);
  try {
    const { userId, eventId, noOfTickets } = req.body;

    // Validate inputs
    if (typeof userId !== 'string' || typeof eventId !== 'string' || typeof noOfTickets !== 'number') {
      return res.status(400).json({ error: 'Invalid input' });
    }

    // Fetch event details
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if the event is on sale
    if (event.statusCode !== 'onsale') {
      return res.status(400).json({ error: 'Event is not on sale' });
    }

    // Check ticket availability if it's defined
    if (event.no_of_tickets !== null && event.no_of_tickets !== undefined) {
      if (event.no_of_tickets < noOfTickets) {
        return res.status(400).json({ error: 'Not enough tickets available' });
      }
    }

    // Begin transaction
    await prisma.$transaction(async (prisma) => {
      
      let price = 0;
      console.log("events = {}", event);
      console.log("price = ={}", event.price);
      console.log("noOfTickets = = {}", event.no_of_tickets);
      // Update event tickets if no_of_tickets is defined
      if (event.no_of_tickets !== null && event.no_of_tickets !== undefined) {
        await prisma.event.update({
          where: { id: eventId },
          data: { no_of_tickets: event.no_of_tickets - noOfTickets },
        });
        console.log("here");
        price = event.price * noOfTickets;
      }

      console.log("here = = {}", price);

      // Create UserEvent entry
      const userEvent = await prisma.userEvent.create({
        data: {
          user_id: userId,
          event_id: eventId,
          status: 'purchased',
          no_of_tickets: noOfTickets,
          total_price: price, // Assuming no price calculation for simplicity
        },
      });

      const venue = await prisma.venue.findUnique({
        where: { id: event.venueId }
      });
  
      const location = venue ? `${venue.city}, ${venue.state}` : 'No venue Found';

      // Send confirmation email
      const purchaseDetails = {
        eventName: event.name,
        location: location,
        localDate: event.localDate,
        localTime: event.localTime,
        numberOfTickets: noOfTickets,
        totalPrice: event.price * noOfTickets,
      };

      // Fetch user's email
      const user = await prisma.user.findUnique({ where: { auth0_id: userId }, select: { email: true } });

      // if (user) {
      //   await sendPurchaseConfirmationEmail(user.email, purchaseDetails);
      // }

    });

    return res.status(200).json({ message: 'Tickets purchased successfully' });
  } catch (err) {
    console.error('Error buying tickets:', err);
    return res.status(500).json({ error: 'Failed to buy tickets' });
  } finally {
    await prisma.$disconnect();
  }
};



/**
 * Update the status of a UserEvent entry.
 * @param {Object} req - The request object containing user ID, event ID, and new status.
 * @param {Object} res - The response object for sending responses.
 */
exports.updateUserEventStatus = async (req, res) => {
  try {
    const {userId, eventId, newStatus } = req.body;

    // Validate inputs
    if (typeof userId !== 'string' || typeof eventId !== 'string' || !['going', 'not-going'].includes(newStatus)) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    // Fetch the event details
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { statusCode: true },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if the event is expired
    if (event.statusCode === 'expired') {
      return res.status(400).json({ error: 'Cannot update status for an expired event' });
    }

    // Update the UserEvent status
    const userEvent = await prisma.userEvent.updateMany({
      where: {
        user_id: userId,
        event_id: eventId
      },
      data: {
        status: newStatus,
      },
    });

    if (userEvent.count === 0) {
      return res.status(404).json({ error: 'UserEvent not found or status already updated' });
    }

    return res.status(200).json({ message: 'UserEvent status updated successfully' });
  } catch (err) {
    console.error('Error updating UserEvent status:', err);
    return res.status(500).json({ error: 'Failed to update UserEvent status' });
  } finally {
    await prisma.$disconnect();
  }
};

exports.getUserHistory = async (req, res) => {
  const {userId} = req.body;
  try {
    // Fetch all UserEvent records associated with the user
    const userEvents = await prisma.userEvent.findMany({
      where: { user_id: userId },
      include: {
        event: true // Include event details in the result
      }
    });

    
      res.json(userEvents);
   
      //res.status(404).json({ error: 'No history found for this user.' });
    
  } catch (err) {
    console.log("Error in fetching user history", err);
    res.status(500).json({ error: 'Failed to fetch user history.' });
  }
};

// Get events posted by a user
exports.getEventsPosted = async (req, res) => {
  const {userId} = req.body;

  try {
    // Fetch the user's eventsPosted JSON field
    const user = await prisma.user.findUnique({
      where: { auth0_id: userId },
      select: { eventsPostedId: true } // Fetch only the eventsPosted field
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Parse eventsPosted JSON field
    const eventsPostedIds = user.eventsPostedId ? JSON.parse(user.eventsPostedId) : [];

    // If no events are posted, return an empty array
    if (eventsPostedIds.length === 0) {
      return res.json([]);
    }

    // Fetch details of the events
    const events = await prisma.event.findMany({
      where: {
        id: {
          in: eventsPostedIds
        }
      }
    });

    // Return the events details as a response
    res.json(events);

  } catch (error) {
    console.error('Error fetching events posted by user:', error);
    res.status(500).json({ error: 'Failed to fetch events.' });
  }
};

