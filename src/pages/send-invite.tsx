import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { email, household_id } = req.body;

  if (!email || !household_id) {
    return res.status(400).json({ error: "Missing email or household_id" });
  }

  try {
    const inviteUrl = `https://getmealzy.com/invite?household_id=${household_id}`;

    const data = await resend.emails.send({
      from: "invites@getmealzy.com",
      to: email,
      subject: "Du wurdest zu Mealzy eingeladen",
      html: `
        <h1>Willkommen bei Mealzy 👋</h1>
        <p>Du wurdest zu einem Haushalt eingeladen.</p>
        <p><a href="${inviteUrl}">Hier klicken, um dein Profil anzulegen</a></p>
      `,
    });

    console.log("Email sent:", data);
    return res.status(200).json({ message: "Invite sent" });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ error: "Failed to send invite" });
  }
}
