// Stub for astronomy calculations for celestial-engine.ts
export interface PlanetaryPosition {
    planet: string;
    longitude: number;
    constellation: string;
    zodiacSign: string;
}

export function calculatePlanetaryPositions(date: Date): PlanetaryPosition[] {
    // Return mock, deterministic data for demonstration purposes
    const dayOfYear = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 86400000;
    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    
    return planets.map((p, i) => {
        const longitude = (dayOfYear + i * 50) % 360;
        const signIndex = Math.floor(longitude / 30);
        return {
            planet: p,
            longitude: parseFloat(longitude.toFixed(2)),
            constellation: signs[signIndex], // Using zodiac signs as constellations for simplicity
            zodiacSign: signs[signIndex],
        };
    });
}
