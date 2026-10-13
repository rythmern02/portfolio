// Booking a call. Any button can open the Calendly modal by dispatching this
// event; without JavaScript the same buttons link straight to Calendly.

export const CALENDLY_URL = "https://calendly.com/rythme/30min";

// Calendly reads these to match the embed to the site's colours.
export const CALENDLY_EMBED = `${CALENDLY_URL}?hide_gdpr_banner=1&background_color=0a0d16&text_color=f4f6fa&primary_color=8fd3ff`;

export const BOOK_EVENT = "arcane:book";

export function openBooking() {
  window.dispatchEvent(new Event(BOOK_EVENT));
}
