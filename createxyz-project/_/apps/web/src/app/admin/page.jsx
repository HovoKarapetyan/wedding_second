"use client";

import { useState, useEffect } from "react";
import { Heart, Users, Check, X, Mail, MessageSquare } from "lucide-react";

export default function AdminPage() {
  const [rsvps, setRsvps] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRSVPs();
  }, []);

  const fetchRSVPs = async () => {
    try {
      const response = await fetch("/api/rsvp");
      if (!response.ok) {
        throw new Error("Failed to fetch RSVPs");
      }
      const data = await response.json();
      setRsvps(data.rsvps);
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
      setError("Failed to load RSVP responses");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF9F5] flex items-center justify-center">
        <div className="text-center">
          <Heart className="mx-auto text-[#E7B18E] mb-4 animate-pulse" size={48} />
          <p className="text-[#8B4513]">Loading RSVP responses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDF9F5] flex items-center justify-center">
        <div className="text-center">
          <X className="mx-auto text-red-500 mb-4" size={48} />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF9F5] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Heart className="mx-auto text-[#E7B18E] mb-6" size={48} />
          <h1 
            className="text-4xl md:text-5xl font-light text-[#8B4513] mb-4"
            style={{ fontFamily: "Instrument Sans, sans-serif" }}
          >
            Wedding RSVP Admin
          </h1>
          <p 
            className="text-lg text-[#8B4513]"
            style={{ fontFamily: "Instrument Sans, sans-serif" }}
          >
            Emma & James Wedding • September 15, 2025
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Users className="mx-auto text-[#E7B18E] mb-3" size={32} />
            <h3 
              className="text-2xl font-bold text-[#8B4513] mb-1"
              style={{ fontFamily: "Instrument Sans, sans-serif" }}
            >
              {stats.total_responses || 0}
            </h3>
            <p className="text-[#8B4513] text-sm">Total Responses</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Check className="mx-auto text-green-500 mb-3" size={32} />
            <h3 
              className="text-2xl font-bold text-[#8B4513] mb-1"
              style={{ fontFamily: "Instrument Sans, sans-serif" }}
            >
              {stats.attending_count || 0}
            </h3>
            <p className="text-[#8B4513] text-sm">Attending</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Heart className="mx-auto text-[#E7B18E] mb-3" size={32} />
            <h3 
              className="text-2xl font-bold text-[#8B4513] mb-1"
              style={{ fontFamily: "Instrument Sans, sans-serif" }}
            >
              {stats.total_guests || 0}
            </h3>
            <p className="text-[#8B4513] text-sm">Total Guests</p>
          </div>
        </div>

        {/* RSVP List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 
              className="text-2xl font-semibold text-[#8B4513]"
              style={{ fontFamily: "Instrument Sans, sans-serif" }}
            >
              RSVP Responses ({rsvps.length})
            </h2>
          </div>

          {rsvps.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">No RSVP responses yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {rsvps.map((rsvp) => (
                <div key={rsvp.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 
                          className="text-lg font-semibold text-[#8B4513] mr-3"
                          style={{ fontFamily: "Instrument Sans, sans-serif" }}
                        >
                          {rsvp.name}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            rsvp.attending
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {rsvp.attending ? (
                            <>
                              <Check size={12} className="mr-1" />
                              Attending
                            </>
                          ) : (
                            <>
                              <X size={12} className="mr-1" />
                              Not Attending
                            </>
                          )}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-[#8B4513]">
                        <p className="flex items-center">
                          <Mail size={14} className="mr-2" />
                          {rsvp.email}
                        </p>
                        
                        {rsvp.attending && (
                          <p className="flex items-center">
                            <Users size={14} className="mr-2" />
                            {rsvp.guest_count} guest{rsvp.guest_count !== 1 ? 's' : ''}
                          </p>
                        )}

                        {rsvp.dietary_restrictions && (
                          <p className="text-xs text-gray-600">
                            <strong>Dietary:</strong> {rsvp.dietary_restrictions}
                          </p>
                        )}

                        {rsvp.message && (
                          <div className="mt-3 p-3 bg-[#FDF9F5] rounded-md">
                            <p className="flex items-start text-xs text-[#8B4513]">
                              <MessageSquare size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                              {rsvp.message}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right text-xs text-gray-500 ml-4">
                      {formatDate(rsvp.created_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Export Options */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              const csvContent = [
                ["Name", "Email", "Attending", "Guests", "Dietary", "Message", "Submitted"],
                ...rsvps.map(rsvp => [
                  rsvp.name,
                  rsvp.email,
                  rsvp.attending ? "Yes" : "No",
                  rsvp.guest_count,
                  rsvp.dietary_restrictions || "",
                  rsvp.message || "",
                  formatDate(rsvp.created_at)
                ])
              ].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");

              const blob = new Blob([csvContent], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "wedding-rsvps.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="bg-[#E7B18E] hover:bg-[#D4A574] text-white px-6 py-3 rounded-md font-medium transition-colors"
            style={{ fontFamily: "Instrument Sans, sans-serif" }}
          >
            Export to CSV
          </button>
        </div>
      </div>
    </div>
  );
}