
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function syncEvents() {
  try {
    let size = 10;
    // Fetch data from Ticketmaster API
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?size=${size}&apikey=AmsLFYVpfYKZOBTRU7vxz9Z2Fs3hEC8m`;
    const response = await axios.get(url);
    const eventsData = response.data._embedded.events;

    // Extract and Sync Venues
    const venuesSet = new Set();
    for (const event of eventsData) {
      if (event._embedded && event._embedded.venues) {
        for (const venue of event._embedded.venues) {
          venuesSet.add(venue); // Collect unique venues
        }
      }
    }

    const venuesArray = Array.from(venuesSet);
    await syncVenues(venuesArray);
  
    // Sync Events
    for (const event of eventsData) {
      
      const localDate = event.dates?.start?.localDate
        ? `${event.dates.start.localDate}T00:00:00Z`
        : new Date().toISOString();
      const venueId = event._embedded.venues && event._embedded.venues[0]?.id || null;


      await prisma.event.upsert({
        where: { id: event.id },
        update: {
          name: event.name,
          type: event.type,
          url: event.url,
          locale: event.locale,
          images: event.images,
          salesStart: event.sales.public.startDateTime,
          salesEnd: event.sales.public.endDateTime,
          localDate: localDate ? new Date(localDate) : null,
          timezone: event.dates.timezone,
          statusCode: event.dates.status.code,
          category: event.classifications[0]?.segment?.name || '',
          venue: {
            connect: { id: venueId }  // Ensure that venueId is correctly assigned
          },
          classifications: event.classifications
        },
        create: {
          id: event.id,
          name: event.name,
          type: event.type,
          url: event.url,
          locale: event.locale,
          images: event.images,
          salesStart: event.sales.public.startDateTime,
          salesEnd: event.sales.public.endDateTime,
          localDate: localDate ? new Date(localDate) : null,
          timezone: event.dates.timezone,
          statusCode: event.dates.status.code,
          category: event.classifications[0]?.segment?.name || '',
          venue: {
            connect: { id: venueId }  // Ensure that venueId is correctly assigned
          },
          classifications: event.classifications
        },
      });
    }
    console.log("Successfully synced events and venues");
  } catch (error) {
    console.error('Error syncing events and venues:', error);
  }
}

async function syncVenues(venues) {
  if (!Array.isArray(venues)) {
    throw new TypeError('Expected an array of venues');
  }

  for (const venue of venues) {
    try {
      await prisma.venue.upsert({
        where: { id: venue.id },
        update: {
          name: venue.name,
          postalCode: venue.postalCode,
          timezone: venue.timezone,
          city: venue.city.name,
          state: venue.state.stateCode,
          country: venue.country.countryCode,
          address: venue.address.line1,
          location: {
            longitude: venue.location.longitude,
            latitude: venue.location.latitude
          },
        },
        create: {
          id: venue.id,
          name: venue.name,
          postalCode: venue.postalCode,
          timezone: venue.timezone,
          city: venue.city.name,
          state: venue.state.stateCode,
          country: venue.country.countryCode,
          address: venue.address.line1,
          location: {
            longitude: venue.location.longitude,
            latitude: venue.location.latitude
          },
        },
      });
    } catch (error) {
      console.error(`Error syncing venue ${venue.id}:`, error);
    }
  }
}

module.exports = { syncEvents };