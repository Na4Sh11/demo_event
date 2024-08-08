const { syncEventsAndVenues } = require('../util/syncAPI');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    // Extract filters from the query parameters
    const filters = { ...req.query };

    // Sync events and venues with the provided filters
    await syncEventsAndVenues(filters);

    // Build Prisma query filter based on the request filters
    const venueFilters = {};
    const eventFilters = {};

    if (filters.postalCode) {
      venueFilters.postalCode = filters.postalCode;
    }

    if (filters.timezone) {
      venueFilters.timezone = filters.timezone;
    }

    if (filters.city) {
      venueFilters.city = filters.city;
    }

    if (filters.state) {
      venueFilters.state = filters.state;
    }

    if (filters.country) {
      venueFilters.country = filters.country;
    }

    // Handle date range filters
    if (filters.startDateTime && filters.endDateTime) {
      eventFilters.localDate = {
        gte: new Date(filters.startDateTime),
        lte: new Date(filters.endDateTime)
      };
    }
    else if(filters.startDateTime) {
      eventFilters.localDate = new Date(filters.startDateTime);
    }

    // Fetch filtered venues from the database
    const filteredVenues = await prisma.venue.findMany({
      where: venueFilters
    });

    // Extract IDs of the filtered venues
    const venueIds = filteredVenues.map(venue => venue.id);

    // Build query condition for events
    const eventWhereCondition = {
      venueId: {
        in: venueIds
      },
      ...eventFilters // Add event date range filter if it exists
    };

    // Fetch events associated with the filtered venues and date range filter
    const events = await prisma.event.findMany({
      where: eventWhereCondition
    });

    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events.' });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  console.log("here in ID = {}", req.params.id);
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id }
    });
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ error: 'Event not found.' });
    }
  } catch (err) {
    console.log("Error in fetching event ", err);
    res.status(500).json({ error: 'Failed to fetch event.' });
  }
};

exports.getVenueById = async(req, res) => {
  try {
    const event = await prisma.venue.findUnique({
      where: { id: req.params.id }
    });
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ error: 'Venue not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch venue.' });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  const { event, venue } = req.body;
  let venueId;

  const localDate = event.dates?.start?.localDate
        ? `${event.dates.start.localDate}T00:00:00Z`
        : new Date().toISOString();
    

  if(venue) {
    venueId = venue.id;

    try {
      await prisma.venue.create({
        data: {
          id: venue.id,
          name: venue.name || null,
          postalCode: venue.postalCode || null,
          timezone: venue.timezone || null,
          city: venue.city?.name || null,
          state: venue.state?.stateCode || null,
          country: venue.country?.countryCode || null,
          address: venue.address?.line1 || null,
          location: {
            longitude: venue.location?.longitude || null,
            latitude: venue.location?.latitude || null
          },
        },
      });
    } catch (error) {
      console.error('Venue Exists');
    }
  }
  else  
    venueId = req.body.venueId;

  try {
      const createdEvent = await prisma.event.create({
        data: {
          id: event.id,
          name: event.name || null,
          type: event.type || null,
          url: event.url || null,
          locale: event.locale || null,
          images: event.images || null,
          salesStart: event.sales.public.startDateTime || null,
          salesEnd: event.sales.public.endDateTime || null,
          localDate: localDate ? new Date(localDate) : null,
          localTime : event.dates?.start?.localTime || null,
          timezone: event.dates?.timezone || null,
          statusCode: event.dates?.status.code || null,
          category: event.classifications[0]?.segment?.name || '',
          postedById: event.userId,
          venue: {
            connect: { id: venueId }  // Ensure that venueId is correctly assigned
          },
          classifications: event.classifications || null
        },
      });
      
    res.status(200).json({ message: 'Event created', createdEvent });
    } catch (error) {
      console.error(`Error syncing venue ${venueId}:`, error);
      res.status(500).json({ error: 'Event with same ID exists' });
    }
};

exports.updateEvent = async (req, res) => {
  const { event, venue } = req.body;
  const eventId = req.params.id; // Assuming you pass the event ID as a URL parameter
  let venueId;

  const localDate = event.dates?.start?.localDate
        ? `${event.dates.start.localDate}T00:00:00Z`
        : new Date().toISOString();

  try {
    if (venue) {
      venueId = venue.id;

      await prisma.venue.upsert({
        where: { id: venue.id },
        update: {
          name: venue.name || null,
          postalCode: venue.postalCode || null,
          timezone: venue.timezone || null,
          city: venue.city?.name || null,
          state: venue.state?.stateCode || null,
          country: venue.country?.countryCode || null,
          address: venue.address?.line1 || null,
          location: {
            longitude: venue.location?.longitude || null,
            latitude: venue.location?.latitude || null
          },
        },
        create: {
          id: venue.id,
          name: venue.name || null,
          postalCode: venue.postalCode || null,
          timezone: venue.timezone || null,
          city: venue.city?.name || null,
          state: venue.state?.stateCode || null,
          country: venue.country?.countryCode || null,
          address: venue.address?.line1 || null,
          location: {
            longitude: venue.location?.longitude || null,
            latitude: venue.location?.latitude || null
          },
        },
      });
    } else {
      venueId = req.body.venueId;
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        name: event.name || null,
        type: event.type || null,
        url: event.url || null,
        locale: event.locale || null,
        images: event.images || null,
        salesStart: event.sales.public.startDateTime || null,
        salesEnd: event.sales.public.endDateTime || null,
        localDate: localDate ? new Date(localDate) : null,
        localTime: event.dates?.start?.localTime || null,
        timezone: event.dates?.timezone || null,
        statusCode: event.dates?.status.code || null,
        category: event.classifications[0]?.segment?.name || '',
        postedById: event.userId, // Optional, if you want to update the user
        venue: {
          connect: { id: venueId } // Ensure that venueId is correctly assigned
        },
        classifications: event.classifications || null
      },
    });

    res.status(200).json({ message: 'Event Updated', updatedEvent });
  } catch (error) {
    console.error(`Error updating event ${eventId}:`, error);
    res.status(500).json({ error: `Error updating event ${eventId}` });
  }
};

exports.getEventsByUserID = (req, res) => {
  
}


// Ping endpoint for server health check
exports.ping = (req, res) => {
  try {
    res.status(200).json({ message: 'Server is up and running!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to ping server.' });
  }
};
