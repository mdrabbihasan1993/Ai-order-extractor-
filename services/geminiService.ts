
import { GoogleGenAI, Type } from "@google/genai";
import { OrderDetails } from "../types";

export const extractOrderDetails = async (chatText: string): Promise<OrderDetails> => {
  // Fixed: Always use process.env.API_KEY directly as per SDK guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
      
      STRICT NEGATIVE CONSTRAINTS (IMPORTANT):
      1. PRICE HALLUCINATION: If there is no explicit price mentioned (e.g., "500tk", "Price is 200", "Total 1000", "bill 50"), you MUST return null for "totalPrice".
      2. DO NOT assume numbers in addresses (like "24/1" or "House 5") or phone numbers (like "019...") are prices. If you only see address numbers and phone numbers, set totalPrice to null.
      3. NEVER use default values like 65, 0, or any other number if no financial value is clearly stated.
      4. CUSTOMER NAME: If you cannot find a clear name, return null.
      5. PHONE: Extract the phone number if present, otherwise return null.
      
      Output MUST be valid JSON with fields: customerName, phoneNumber, deliveryAddress, totalPrice, items, note.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          customerName: { type: Type.STRING, description: "Extracted name or null" },
          phoneNumber: { type: Type.STRING, description: "Extracted phone or null" },
          deliveryAddress: { type: Type.STRING, description: "Extracted address or null" },
          totalPrice: { type: Type.NUMBER, description: "Numeric total price. MUST BE null if not found." },
          items: { type: Type.STRING, description: "Items or null" },
          note: { type: Type.STRING, description: "Notes or null" }
        },
        required: ["customerName", "phoneNumber", "deliveryAddress", "totalPrice", "note"]
      }
    },
  });

  try {
    const text = response.text || '{}';
    const data = JSON.parse(text);
    return data;
  } catch (err) {
    console.error("Failed to parse AI response", err);
    throw new Error("Could not parse order details from text.");
  }
};
