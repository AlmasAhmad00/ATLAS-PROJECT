import { GoogleGenAI, Type } from "@google/genai";
import { ClinicVisit, HealthForecast } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function analyzeSymptomTrend(visits: ClinicVisit[]): Promise<HealthForecast | null> {
  // Only analyze if there's a significant number of recent visits with symptoms
  const recentVisits = visits.filter(v => v.symptoms && v.symptoms.length > 0);
  
  if (recentVisits.length < 5) return null;

  const symptomList = recentVisits.flatMap(v => v.symptoms || []);
  const symptomFrequency: Record<string, number> = {};
  symptomList.forEach(s => {
    symptomFrequency[s] = (symptomFrequency[s] || 0) + 1;
  });

  // Check if any symptom is appearing in more than 5 students
  const dominantSymptoms = Object.entries(symptomFrequency)
    .filter(([_, count]) => count >= 5)
    .map(([name]) => name);

  if (dominantSymptoms.length === 0) return null;

  try {
    const prompt = `
      CRITICAL SCHOOL HEALTH ANALYSIS:
      Recent symptom occurrences: ${JSON.stringify(symptomFrequency)}
      Total students affected in this cluster: ${recentVisits.length}

      USER REQUIREMENT: If more than 5-10 students show similar symptoms (especially nausea, stomach ache, vomiting, diarrhea), you MUST alert for potential food poisoning.
      
      Analyze these signals and provide a forecast. If it matches a known disease pattern (like Food Poisoning or Seasonal Flu), identify it.
      Return a title, suspectedDisease, severity (low/moderate/high/critical), a detailed description for school staff, and a suggested pedagogical/hygiene action.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            suspectedDisease: { type: Type.STRING },
            severity: { type: Type.STRING, enum: ["low", "moderate", "high", "critical"] },
            description: { type: Type.STRING },
            suggestedAction: { type: Type.STRING }
          },
          required: ["title", "suspectedDisease", "severity", "description", "suggestedAction"]
        }
      }
    });

    const result = JSON.parse(response.text);
    
    return {
      id: `forecast-${Date.now()}`,
      title: result.title,
      symptoms: dominantSymptoms,
      suspectedDisease: result.suspectedDisease,
      affectedCount: recentVisits.length,
      severity: result.severity,
      description: result.description,
      suggestedAction: result.suggestedAction,
      timestamp: new Date()
    };
  } catch (error) {
    console.error("Health Intelligence Forecast Failed:", error);
    return null;
  }
}
