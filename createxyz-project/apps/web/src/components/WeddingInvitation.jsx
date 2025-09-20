"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  MapPin,
  Calendar,
  Clock,
  Camera,
  Menu,
  X,
  Download,
} from "lucide-react";

export default function WeddingInvitation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [timeLeft, setTimeLeft] = useState({});
  const [rsvpForm, setRsvpForm] = useState({
    name: "",
    email: "",
    attending: "",
    guests: 1,
    dietary: "",
    message: "",
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Wedding date - set to a future date
  const weddingDate = new Date("2025-11-01T17:00:00");
  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Smooth scroll navigation
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  // Handle RSVP form submission
  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rsvpForm),
      });

      if (!response.ok) {
        throw new Error("Failed to submit RSVP");
      }

      setRsvpSubmitted(true);
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      alert(
        "Sorry, there was an error submitting your RSVP. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate calendar file
  const downloadCalendarEvent = () => {
    const startDate =
      weddingDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const endDate =
      new Date(weddingDate.getTime() + 4 * 60 * 60 * 1000)
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0] + "Z";

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding//Wedding Invitation//EN
BEGIN:VEVENT
UID:wedding-${Date.now()}@example.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:Emma & James Wedding
DESCRIPTION:Join us for our special day!
LOCATION:Grand Ballroom, The Heritage Hotel, 123 Main Street, Downtown
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding-invitation.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "story", label: "Our Story" },
    { id: "details", label: "Details" },
    { id: "rsvp", label: "RSVP" },
    { id: "gallery", label: "Gallery" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#F5CDB3]/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div
              className="font-bold text-xl text-[#8B4513] cursor-pointer"
              style={{ fontFamily: "Instrument Sans, sans-serif" }}
              onClick={() => scrollToSection("home")}
            >
              E & J
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-medium text-sm transition-colors duration-200 hover:text-[#E7B18E] ${
                    activeSection === item.id
                      ? "text-[#E7B18E]"
                      : "text-[#8B4513]"
                  }`}
                  style={{ fontFamily: "Instrument Sans, sans-serif" }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-[#8B4513]"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-[#F5CDB3]/20">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left font-medium text-[#8B4513] hover:text-[#E7B18E] transition-colors"
                    style={{ fontFamily: "Instrument Sans, sans-serif" }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1920&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-white/70"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <svg
            className="absolute top-20 left-10 w-16 h-16 text-[#F5CDB3] opacity-60"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
          <svg
            className="absolute bottom-20 right-10 w-20 h-20 text-[#E7B18E] opacity-50"
            viewBox="0 0 100 100"
          >
            <path d="M20,50 Q50,20 80,50 Q50,80 20,50" fill="currentColor" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <Heart className="mx-auto text-[#E7B18E] mb-6" size={48} />
            <h1
              className="text-5xl md:text-7xl font-light text-[#8B4513] mb-4"
              style={{ fontFamily: "Instrument Sans, sans-serif" }}
            >
              Emma & James
            </h1>
            <p
              className="text-xl md:text-2xl text-[#8B4513] mb-8"
              style={{ fontFamily: "Instrument Sans, sans-serif" }}
            >
              are getting married!
            </p>
          </div>

          <div className="mb-12">
            <p
              className="text-lg text-[#8B4513] mb-2"
              style={{ fontFamily: "Instrument Sans, sans-serif" }}
            >
              September 15, 2025 • 4:00 PM
            </p>
            <p
              className="text-lg text-[#8B4513]"
              style={{ fontFamily: "Instrument Sans, sans-serif" }}
            >
              The Heritage Hotel, Downtown
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-12">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="text-center">
                <div
                  className="text-2xl md:text-3xl font-bold text-[#8B4513] mb-1"
                  style={{ fontFamily: "Instrument Sans, sans-serif" }}
                >
                  {value || 0}
                </div>
                <div
                  className="text-sm text-[#8B4513] capitalize"
                  style={{ fontFamily: "Instrument Sans, sans-serif" }}
                >
                  {unit}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scrollToSection("rsvp")}
            className="bg-[#E7B18E] hover:bg-[#D4A574] text-white px-8 py-3 rounded-full font-medium text-lg transition-all duration-200 shadow-md hover:shadow-lg"
            style={{ fontFamily: "Instrument Sans, sans-serif" }}
          >
            RSVP Now
          </button>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="story" className="py-20 px-6 bg-[#FDF9F5]">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl md:text-5xl font-light text-[#8B4513] mb-12"
            style={{ fontFamily: "Instrument Sans, sans-serif" }}
          >
            Our Story
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-left">
              <div>
                <h3
                  className="text-xl font-semibold text-[#8B4513] mb-3"
                  style={{ fontFamily: "Instrument Sans, sans-serif" }}
                >
                  How We Met
                </h3>
                <p
                  className="text-[#8B4513] leading-relaxed"
                  style={{ fontFamily: "Instrument Sans, sans-serif" }}
                >
                  We first crossed paths at a charming coffee shop in downtown,
                  where James was reading a book that Emma had been wanting to
                  read. A conversation about literature turned into hours of
                  talking, and we've been inseparable ever since.
                </p>
              </div>

              <div>
                <h3
                  className="text-xl font-semibold text-[#8B4513] mb-3"
                  style={{ fontFamily: "Instrument Sans, sans-serif" }}
                >
                  The Proposal
                </h3>
                <p
                  className="text-[#8B4513] leading-relaxed"
                  style={{ fontFamily: "Instrument Sans, sans-serif" }}
                >
                  On a beautiful autumn evening, James proposed at the same
                  coffee shop where we first met. With fairy lights twinkling
                  overhead and our favorite song playing softly, it was the
                  perfect beginning to our forever.
                </p>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=600&q=80"
                alt="Emma and James together"
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#F5CDB3] rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Details Section */}
      <section id="details" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-light text-[#8B4513] text-center mb-16"
            style={{ fontFamily: "Instrument Sans, sans-serif" }}
          >
            Wedding Details
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Timeline */}
            <div className="bg-[#FDF9F5] p-8 rounded-lg">
              <h3
                className="text-2xl font-semibold text-[#8B4513] mb-8 flex items-center"
                style={{ fontFamily: "Instrument Sans, sans-serif" }}
              >
                <Clock className="mr-3" size={24} />
                Timeline
              </h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-20 flex-shrink-0">
                    <span className="font-semibold text-[#8B4513]">
                      3:30 PM
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#8B4513]">
                      Guest Arrival
                    </h4>
                    <p className="text-[#8B4513] text-sm">
                      Please arrive early for seating
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-20 flex-shrink-0">
                    <span className="font-semibold text-[#8B4513]">
                      4:00 PM
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#8B4513]">Ceremony</h4>
                    <p className="text-[#8B4513] text-sm">Grand Ballroom</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-20 flex-shrink-0">
                    <span className="font-semibold text-[#8B4513]">
                      5:00 PM
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#8B4513]">
                      Cocktail Hour
                    </h4>
                    <p className="text-[#8B4513] text-sm">Garden Terrace</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-20 flex-shrink-0">
                    <span className="font-semibold text-[#8B4513]">
                      6:30 PM
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#8B4513]">
                      Reception & Dinner
                    </h4>
                    <p className="text-[#8B4513] text-sm">Grand Ballroom</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-20 flex-shrink-0">
                    <span className="font-semibold text-[#8B4513]">
                      8:00 PM
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#8B4513]">Dancing</h4>
                    <p className="text-[#8B4513] text-sm">Let's celebrate!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-[#FDF9F5] p-8 rounded-lg">
              <h3
                className="text-2xl font-semibold text-[#8B4513] mb-8 flex items-center"
                style={{ fontFamily: "Instrument Sans, sans-serif" }}
              >
                <MapPin className="mr-3" size={24} />
                Location
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-semibold text-[#8B4513]">
                    The Heritage Hotel
                  </h4>
                  <p className="text-[#8B4513]">123 Main Street</p>
                  <p className="text-[#8B4513]">Downtown, State 12345</p>
                </div>

                <div>
                  <h4 className="font-semibold text-[#8B4513]">Parking</h4>
                  <p className="text-[#8B4513] text-sm">
                    Complimentary valet parking available
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-[#8B4513]">
                    Accommodations
                  </h4>
                  <p className="text-[#8B4513] text-sm">
                    Special room rates available for wedding guests
                  </p>
                </div>
              </div>

              <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                <p className="text-gray-600">Interactive Map</p>
              </div>

              <div className="mt-4 flex space-x-4">
                <button className="bg-[#E7B18E] text-white px-4 py-2 rounded font-medium text-sm hover:bg-[#D4A574] transition-colors">
                  Get Directions
                </button>
                <button
                  onClick={downloadCalendarEvent}
                  className="border border-[#E7B18E] text-[#E7B18E] px-4 py-2 rounded font-medium text-sm hover:bg-[#E7B18E] hover:text-white transition-colors flex items-center"
                >
                  <Download className="mr-2" size={16} />
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="py-20 px-6 bg-[#FDF9F5]">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl md:text-5xl font-light text-[#8B4513] mb-4"
            style={{ fontFamily: "Instrument Sans, sans-serif" }}
          >
            RSVP
          </h2>
          <p
            className="text-lg text-[#8B4513] mb-12"
            style={{ fontFamily: "Instrument Sans, sans-serif" }}
          >
            Please respond by August 1st, 2025
          </p>

          {rsvpSubmitted ? (
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
              <Heart className="mx-auto text-[#E7B18E] mb-4" size={48} />
              <h3 className="text-2xl font-semibold text-[#8B4513] mb-4">
                Thank You!
              </h3>
              <p className="text-[#8B4513]">
                We've received your RSVP and can't wait to celebrate with you!
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleRsvpSubmit}
              className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto"
            >
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[#8B4513] font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpForm.name}
                    onChange={(e) =>
                      setRsvpForm({ ...rsvpForm, name: e.target.value })
                    }
                    className="w-full p-3 border border-[#F5CDB3] rounded-md focus:ring-2 focus:ring-[#E7B18E] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-[#8B4513] font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={rsvpForm.email}
                    onChange={(e) =>
                      setRsvpForm({ ...rsvpForm, email: e.target.value })
                    }
                    className="w-full p-3 border border-[#F5CDB3] rounded-md focus:ring-2 focus:ring-[#E7B18E] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-[#8B4513] font-medium mb-2">
                  Will you be attending? *
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="attending"
                      value="yes"
                      checked={rsvpForm.attending === "yes"}
                      onChange={(e) =>
                        setRsvpForm({ ...rsvpForm, attending: e.target.value })
                      }
                      className="mr-2"
                    />
                    <span className="text-[#8B4513]">Yes, I'll be there!</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="attending"
                      value="no"
                      checked={rsvpForm.attending === "no"}
                      onChange={(e) =>
                        setRsvpForm({ ...rsvpForm, attending: e.target.value })
                      }
                      className="mr-2"
                    />
                    <span className="text-[#8B4513]">Sorry, can't make it</span>
                  </label>
                </div>
              </div>

              {rsvpForm.attending === "yes" && (
                <>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-[#8B4513] font-medium mb-2">
                        Number of Guests
                      </label>
                      <select
                        value={rsvpForm.guests}
                        onChange={(e) =>
                          setRsvpForm({
                            ...rsvpForm,
                            guests: parseInt(e.target.value),
                          })
                        }
                        className="w-full p-3 border border-[#F5CDB3] rounded-md focus:ring-2 focus:ring-[#E7B18E] focus:border-transparent"
                      >
                        <option value={1}>1 Guest</option>
                        <option value={2}>2 Guests</option>
                        <option value={3}>3 Guests</option>
                        <option value={4}>4 Guests</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#8B4513] font-medium mb-2">
                        Dietary Restrictions
                      </label>
                      <input
                        type="text"
                        value={rsvpForm.dietary}
                        onChange={(e) =>
                          setRsvpForm({ ...rsvpForm, dietary: e.target.value })
                        }
                        placeholder="Vegetarian, allergies, etc."
                        className="w-full p-3 border border-[#F5CDB3] rounded-md focus:ring-2 focus:ring-[#E7B18E] focus:border-transparent"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="mb-6">
                <label className="block text-[#8B4513] font-medium mb-2">
                  Message for the Couple
                </label>
                <textarea
                  value={rsvpForm.message}
                  onChange={(e) =>
                    setRsvpForm({ ...rsvpForm, message: e.target.value })
                  }
                  placeholder="Share your well wishes..."
                  rows={4}
                  className="w-full p-3 border border-[#F5CDB3] rounded-md focus:ring-2 focus:ring-[#E7B18E] focus:border-transparent"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#E7B18E] hover:bg-[#D4A574] text-white py-3 rounded-md font-medium text-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit RSVP"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 px-6 bg-[#FDF9F5]">
        <div className="max-w-6xl mx-auto text-center">
          <h2
            className="text-4xl md:text-5xl font-light text-[#8B4513] mb-12"
            style={{ fontFamily: "Instrument Sans, sans-serif" }}
          >
            Our Journey
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=400&q=80",
            ].map((src, index) => (
              <div
                key={index}
                className="relative group cursor-pointer overflow-hidden rounded-lg"
              >
                <img
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <Camera
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    size={32}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#8B4513] text-white py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Heart className="mx-auto text-[#F5CDB3] mb-4" size={48} />
            <h3
              className="text-2xl font-light mb-2"
              style={{ fontFamily: "Instrument Sans, sans-serif" }}
            >
              Emma & James
            </h3>
            <p style={{ fontFamily: "Instrument Sans, sans-serif" }}>
              September 15, 2025
            </p>
          </div>

          <div className="border-t border-white/20 pt-8">
            <p className="text-sm opacity-80">
              Questions? Contact us at{" "}
              <a
                href="mailto:wedding@emmajames.com"
                className="underline hover:no-underline"
              >
                wedding@emmajames.com
              </a>
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}