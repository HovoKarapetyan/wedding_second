import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, attending, guests, dietary, message } = body;

    // Validate required fields
    if (!name || !email || !attending) {
      return Response.json(
        { error: "Name, email, and attendance response are required" },
        { status: 400 }
      );
    }

    // Convert attending string to boolean
    const attendingBool = attending === "yes";
    const guestCount = attendingBool ? guests || 1 : 0;

    // Insert RSVP into database
    const result = await sql`
      INSERT INTO rsvp_responses (name, email, attending, guest_count, dietary_restrictions, message)
      VALUES (${name}, ${email}, ${attendingBool}, ${guestCount}, ${dietary || ""}, ${message || ""})
      RETURNING id, name, email, attending, guest_count, created_at
    `;

    return Response.json({
      success: true,
      rsvp: result[0],
      message: "RSVP submitted successfully"
    });

  } catch (error) {
    console.error("Error submitting RSVP:", error);
    return Response.json(
      { error: "Failed to submit RSVP" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Get all RSVP responses (for the couple to view)
    const rsvps = await sql`
      SELECT id, name, email, attending, guest_count, dietary_restrictions, message, created_at
      FROM rsvp_responses
      ORDER BY created_at DESC
    `;

    // Count total attending guests
    const attendingStats = await sql`
      SELECT 
        COUNT(*) as total_responses,
        SUM(CASE WHEN attending = true THEN 1 ELSE 0 END) as attending_count,
        SUM(CASE WHEN attending = true THEN guest_count ELSE 0 END) as total_guests
      FROM rsvp_responses
    `;

    return Response.json({
      rsvps,
      stats: attendingStats[0]
    });

  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    return Response.json(
      { error: "Failed to fetch RSVPs" },
      { status: 500 }
    );
  }
}