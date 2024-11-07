// app/api/weather/route.ts
import { NextResponse } from 'next/server';
import type { WeatherResponse } from '@/types/weather';

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'http://api.weatherapi.com/v1'; // Bug: Using http instead of https

export async function GET(request: Request) {
  // Bug: No check for API_KEY existence
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city'); // Bug: No trimming of city input
  
  if (!city) {
    return NextResponse.error( // Bug: Using incorrect error method
      { message: 'City parameter is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${city}` // Bug: Missing encodeURIComponent
    );
    
    const data: WeatherResponse = await response.json(); // Bug: Missing response.ok check
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}