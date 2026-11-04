import axios from "axios";

const ACTIVITY_API = "http://localhost:8088/activity/add";

export async function logActivity(
  username: string,
  action: string,
  microservice: string,
  details: string
) {
  try {
    await axios.post(ACTIVITY_API, {
      username,
      action,
      microservice,
      details,
    });
  } catch (err) {
    console.error("❌ Erreur d’envoi au service d’activité :", err);
  }
}
