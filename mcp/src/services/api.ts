import { env } from "../config/env.js";

export class SecondBrainApi {
  async get(path: string) {
    const response = await fetch(
      `${env.SECOND_BRAIN_API_URL}${path}`,
      {
        headers: {
          "x-api-key": env.SECOND_BRAIN_API_KEY,
          Authorization: `Bearer ${env.SECOND_BRAIN_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async post(path: string, body: unknown) {
    const response = await fetch(
      `${env.SECOND_BRAIN_API_URL}${path}`,
      {
        method: "POST",
        headers: {
          "x-api-key": env.SECOND_BRAIN_API_KEY,
          Authorization: `Bearer ${env.SECOND_BRAIN_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async getCurrentUser() {
    return this.get("/auth/me");
  }
}

export const api = new SecondBrainApi();