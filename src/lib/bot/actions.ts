import { createServerFn } from "@tanstack/react-start";
import { handleIncoming } from "./engine";
import { listLeads } from "./session";
import { whatsappConfigured } from "./whatsapp";

export const sendBotMessage = createServerFn({ method: "POST" })
  .validator((input: { sessionId: string; text: string }) => input)
  .handler(async ({ data }) => {
    const result = await handleIncoming({
      userId: `web:${data.sessionId}`,
      text: data.text,
      channel: "web",
    });
    return result;
  });

export const getLeads = createServerFn({ method: "GET" }).handler(() => {
  return listLeads();
});

export const getBotStatus = createServerFn({ method: "GET" }).handler(() => {
  return {
    whatsapp: whatsappConfigured(),
    ai: Boolean(process.env.XAI_API_KEY),
    verifyTokenSet: Boolean(process.env.WHATSAPP_VERIFY_TOKEN),
  };
});
