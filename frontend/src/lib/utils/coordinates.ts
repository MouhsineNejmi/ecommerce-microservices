export const countryCoordinates: Record<
  string,
  { lat: number; lng: number; zoom: number }
> = {
  US: { lat: 37.0902, lng: -95.7129, zoom: 4 },
  CA: { lat: 56.1304, lng: -106.3468, zoom: 4 },
  GB: { lat: 55.3781, lng: -3.436, zoom: 5 },
  AU: { lat: -25.2744, lng: 133.7751, zoom: 4 },
  DE: { lat: 51.1657, lng: 10.4515, zoom: 6 },
  FR: { lat: 46.2276, lng: 2.2137, zoom: 6 },
  JP: { lat: 36.2048, lng: 138.2529, zoom: 5 },
  CN: { lat: 35.8617, lng: 104.1954, zoom: 4 },
  IN: { lat: 20.5937, lng: 78.9629, zoom: 4 },
  BR: { lat: -14.235, lng: -51.9253, zoom: 4 },
  RU: { lat: 61.524, lng: 105.3188, zoom: 3 },
  IT: { lat: 41.8719, lng: 12.5674, zoom: 6 },
  ES: { lat: 40.4637, lng: -3.7492, zoom: 6 },
  MX: { lat: 23.6345, lng: -102.5528, zoom: 5 },
  KR: { lat: 35.9078, lng: 127.7669, zoom: 7 },
  NL: { lat: 52.1326, lng: 5.2913, zoom: 7 },
  SG: { lat: 1.3521, lng: 103.8198, zoom: 11 },
  ZA: { lat: -30.5595, lng: 22.9375, zoom: 5 },
  AR: { lat: -38.4161, lng: -63.6167, zoom: 4 },
  EG: { lat: 26.8206, lng: 30.8025, zoom: 6 },
  MA: { lat: 31.7917, lng: -7.0926, zoom: 6 },
};

export function getCountryCoordinates(countryCode: string) {
  return countryCoordinates[countryCode] || { lat: 0, lng: 0, zoom: 2 };
}
