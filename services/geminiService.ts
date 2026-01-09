
import { GoogleGenAI, Type } from "@google/genai";
import { OrderDetails } from "../types";

export const extractOrderDetails = async (chatText: string): Promise<OrderDetails> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract order details from the following Facebook Messenger chat text. 
    The text might be in English, Bengali, or a mix (Banglish). 
    Return the information as JSON. 
    
    Chat Text: 
    ${chatText}`,
    config: {
      systemInstruction: `You are an expert order processing assistant for e-commerce merchants. 
      Your goal is to accurately extract Customer Name, Phone Number, Delivery Address, and Total Price from chat transcripts. 
      
      CRITICAL RULES:
      1. DO NOT GUESS OR HALLUCINATE. If a field is not explicitly mentioned in the text, you MUST return null for that field.
      2. NEVER provide a default price (like 65 or 0) if no price is mentioned. If there is no mention of money/taka/tk/price, set totalPrice to null.
      3. Do not assume information from context that isn't clearly stated as a fact.
      4. If a piece of information is missing (e.g., no price mentioned), just leave it as null. 
      5. Use the 'note' field for any special requests, delivery instructions, or additional details actually present in the text.
      6. Clean phone numbers of any formatting.
      7. Ensure prices are returned as numbers.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          customerName: { type: Type.STRING, description: "Full name if present, else null" },
          phoneNumber: { type: Type.STRING, description: "Phone number if present, else null" },
          deliveryAddress: { type: Type.STRING, description: "Full address if present, else null" },
          totalPrice: { type: Type.NUMBER, description: "Numeric value of the price if present, else null" },
          items: { type: Type.STRING, description: "Items mentioned if any, else null" },
          note: { type: Type.STRING, description: "Extra notes or instructions if present, else null" }
        },
        required: ["customerName", "phoneNumber", "deliveryAddress", "totalPrice", "note"]
      }
    },
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return data;
  } catch (err) {
    console.error("Failed to parse AI response", err);
    throw new Error("Could not parse order details from text.");
  }
};
