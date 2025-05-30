import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, Timestamp, doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

interface MentalMetric {
  moodScore: number;
  sentiment: string;
  topics: string[];
  timestamp?: any; // Will be set by serverTimestamp
}

export interface MentalMetricWithId extends MentalMetric {
  id: string;
}

/**
 * Saves mental metrics data to Firestore
 * @param userId - The user's ID
 * @param data - The mental metrics data to save
 * @returns The ID of the created document
 */
export async function saveMentalMetrics(
  userId: string,
  data: Omit<MentalMetric, 'timestamp'>
): Promise<string> {
  try {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }

    if (!auth?.currentUser) {
      throw new Error('User must be authenticated to save mental metrics');
    }

    if (auth.currentUser.uid !== userId) {
      throw new Error('User can only save metrics for their own account');
    }

    console.log('Saving mental metrics for user:', userId);

    // First, ensure the user document exists
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      lastActive: serverTimestamp(),
      updatedAt: serverTimestamp(),
      email: auth.currentUser.email,
      displayName: auth.currentUser.displayName
    }, { merge: true });

    // Then write to the subcollection
    const metricsRef = collection(db, 'users', userId, 'mental_metrics');
    const docRef = await addDoc(metricsRef, {
      ...data,
      timestamp: serverTimestamp(),
      userId: userId // Add userId to the document for additional security
    });

    console.log('Mental metrics saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving mental metrics:', error);
    // Add more detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    throw error;
  }
}

/**
 * Fetches mental metrics data for a user
 * @param userId - The user's ID
 * @returns Array of mental metrics with document IDs
 */
export async function getMentalMetrics(userId: string): Promise<MentalMetricWithId[]> {
  try {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }

    const metricsRef = collection(db, 'users', userId, 'mental_metrics');
    const q = query(metricsRef, orderBy('timestamp', 'desc'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    })) as MentalMetricWithId[];
  } catch (error) {
    console.error('Error fetching mental metrics:', error);
    throw error;
  }
}

/**
 * Analyzes a chat message and saves mental metrics if a user is signed in
 * @param message - The chat message to analyze
 * @param auth - The Firebase auth instance
 * @returns Promise that resolves when analysis is complete
 */
export async function analyzeAndSaveChatMetrics(
  message: string,
  auth: any
): Promise<void> {
  try {
    // Check if user is signed in
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('No user signed in, skipping mental metrics analysis');
      return;
    }

    console.log('Current user:', currentUser.uid);

    // First ensure user document exists
    const userRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.log('Creating user document for:', currentUser.uid);
      await setDoc(userRef, {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        email: currentUser.email,
        displayName: currentUser.displayName,
        lastActive: serverTimestamp()
      });
    }

    // Analyze sentiment and extract topics using Google AI
    const analysisPrompt = `Analyze the following message and provide a JSON response with:
1. A mood score from 1-10 (1 being very negative, 10 being very positive)
2. The overall sentiment (positive, negative, or neutral)
3. Key topics mentioned (as an array of strings)

Message: "${message}"

Respond with ONLY a JSON object in this exact format, with no markdown formatting or additional text:
{
  "moodScore": number,
  "sentiment": string,
  "topics": string[]
}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: analysisPrompt }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 0.1,
          maxOutputTokens: 200,
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze message');
    }

    const data = await response.json();
    const analysisText = data.candidates[0].content.parts[0].text;

    // Clean the response text to ensure it's valid JSON
    const cleanJson = analysisText
      .replace(/```json\s*|\s*```/g, '') // Remove markdown code block markers
      .replace(/^\s*|\s*$/g, '');

    // Parse the JSON response
    const analysis = JSON.parse(cleanJson);

    // Validate the analysis data
    if (typeof analysis.moodScore !== 'number' ||
      typeof analysis.sentiment !== 'string' ||
      !Array.isArray(analysis.topics)) {
      throw new Error('Invalid analysis format');
    }

    // Ensure moodScore is within range
    analysis.moodScore = Math.max(1, Math.min(10, Math.round(analysis.moodScore)));

    // Save the metrics
    await saveMentalMetrics(currentUser.uid, {
      moodScore: analysis.moodScore,
      sentiment: analysis.sentiment,
      topics: analysis.topics,
    });

    console.log('Mental metrics saved for message analysis');
  } catch (error) {
    console.error('Error analyzing and saving chat metrics:', error);
    // Add more detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    // Don't throw the error to prevent disrupting the chat flow
  }
}

/**
 * Analyzes a chatbot response using keyword matching to determine mood metrics
 * @param response - The chatbot's response text
 * @returns Object containing moodScore, sentiment, and topics
 */
export function analyzeResponseMetrics(response: string): {
  moodScore: number;
  sentiment: string;
  topics: string[];
} {
  // Convert response to lowercase for case-insensitive matching
  const text = response.toLowerCase();

  // Define sentiment keywords and their scores
  const sentimentKeywords = {
    positive: {
      words: ['happy', 'joy', 'great', 'wonderful', 'excellent', 'amazing', 'fantastic', 'good', 'positive', 'better', 'improve', 'help', 'support', 'encourage', 'hope', 'relief', 'calm', 'peace', 'grateful', 'thankful'],
      score: 1
    },
    negative: {
      words: ['sad', 'angry', 'upset', 'terrible', 'awful', 'bad', 'negative', 'worse', 'hurt', 'pain', 'anxiety', 'stress', 'worry', 'fear', 'scared', 'depressed', 'lonely', 'tired', 'exhausted'],
      score: -1
    },
    neutral: {
      words: ['okay', 'fine', 'alright', 'neutral', 'normal', 'average', 'moderate', 'balanced', 'stable'],
      score: 0
    }
  };

  // Define topic keywords
  const topicKeywords = {
    work: ['work', 'job', 'career', 'office', 'business', 'project', 'deadline', 'meeting', 'colleague', 'boss'],
    family: ['family', 'parent', 'child', 'sibling', 'spouse', 'partner', 'marriage', 'relationship', 'home', 'household'],
    health: ['health', 'exercise', 'fitness', 'diet', 'sleep', 'rest', 'energy', 'physical', 'mental', 'wellness'],
    social: ['friend', 'social', 'party', 'gathering', 'event', 'group', 'community', 'network', 'connection'],
    personal: ['personal', 'hobby', 'interest', 'passion', 'goal', 'dream', 'aspiration', 'growth', 'development'],
    stress: ['stress', 'anxiety', 'pressure', 'tension', 'worry', 'concern', 'overwhelm', 'burnout'],
    emotions: ['emotion', 'feeling', 'mood', 'happiness', 'sadness', 'anger', 'fear', 'joy', 'love', 'hate']
  };

  // Calculate sentiment score
  let sentimentScore = 0;
  let sentimentCount = 0;
  let detectedSentiment = 'neutral';

  Object.entries(sentimentKeywords).forEach(([sentiment, { words, score }]) => {
    words.forEach(word => {
      if (text.includes(word)) {
        sentimentScore += score;
        sentimentCount++;
        detectedSentiment = sentiment;
      }
    });
  });

  // Calculate mood score (0-10)
  // Start with neutral score of 5
  let moodScore = 5;
  if (sentimentCount > 0) {
    // Adjust based on sentiment score
    moodScore = Math.max(0, Math.min(10, 5 + sentimentScore));
  }

  // Detect topics
  const detectedTopics = Object.entries(topicKeywords)
    .filter(([_, keywords]) =>
      keywords.some(keyword => text.includes(keyword))
    )
    .map(([topic]) => topic);

  // If no topics detected, add 'general' as default
  if (detectedTopics.length === 0) {
    detectedTopics.push('general');
  }

  return {
    moodScore: Math.round(moodScore),
    sentiment: detectedSentiment,
    topics: detectedTopics
  };
}

/**
 * Example usage:
 * 
 * ```typescript
 * try {
 *   const userId = 'user123';
 *   const metrics = {
 *     moodScore: 8,
 *     sentiment: 'positive',
 *     topics: ['work', 'family', 'health']
 *   };
 *   
 *   const docId = await saveMentalMetrics(userId, metrics);
 *   console.log('Saved metrics with ID:', docId);
 * } catch (error) {
 *   console.error('Failed to save metrics:', error);
 * }
 * ```
 */ 