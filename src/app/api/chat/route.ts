import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
});

const SYSTEM_PROMPT = `You are an AI assistant for the F400 application, a product management and SPS (Single Point of Success) analysis platform.

## About F400:
- **Purpose**: Track and analyze product performance metrics across multiple years (2023-2027)
- **Key Features**:
  - Product year-specific data management
  - SPS Waterfall Analysis visualization
  - CSV import/export for bulk data operations
  - Header image customization
  
## Key Metrics Explained:
- **DT (Design Time)**: Time spent in design phase
- **UT (Useful Time)**: Productive time spent on the product
- **NVA (Non-Value Added)**: Time spent on non-productive activities
- **KD (Kaizen Delta)**: Efficiency improvement percentage
- **KE, KER, KSR**: Additional performance metrics
- **OT (Overall Time)**: Total time spent
- **TSR**: Time series reference

## SPS Analysis:
SPS (Single Point of Success) is a waterfall analysis that visualizes the flow from:
OT → DT → UT → NVA
This helps identify bottlenecks and optimization opportunities in product development.

## Year-Specific Product Management:
- Products can be added to specific years only
- A product in 2023 won't automatically appear in 2024
- Each year has its own product list and data
- Admins can add/remove products per year via the year management page

## Admin Features:
- Year data management (per year)
- CSV import/export for bulk operations
- Product addition/removal per year
- Header image customization
- User management
- Password changing

Be helpful, concise, and provide specific guidance about using F400 features. Keep responses brief and friendly.`;

export async function POST(request: Request) {
    try {
        const { message, history } = await request.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Gemini API key not configured' },
                { status: 500 }
            );
        }

        // Build conversation history
        const contents = [
            {
                role: 'user',
                parts: [{ text: SYSTEM_PROMPT }],
            },
            {
                role: 'model',
                parts: [{ text: 'I understand! I\'m ready to help with F400 questions.' }],
            },
            ...(history || []).flatMap((msg: any) => [
                {
                    role: 'user',
                    parts: [{ text: msg.role === 'user' ? msg.content : '' }],
                },
                {
                    role: 'model',
                    parts: [{ text: msg.role === 'assistant' ? msg.content : '' }],
                },
            ]).filter((msg: any) => msg.parts[0].text),
            {
                role: 'user',
                parts: [{ text: message }],
            },
        ];

        const model = 'gemini-2.0-flash-lite';

        const response = await ai.models.generateContent({
            model,
            contents,
        });

        const text = response.text || 'Sorry, I couldn\'t generate a response.';

        return NextResponse.json({ response: text });
    } catch (error: any) {
        console.error('Gemini AI error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate response' },
            { status: 500 }
        );
    }
}
