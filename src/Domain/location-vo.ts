export class Location {
  readonly latitude: number;
  readonly longitude: number;

  constructor(latitude: number, longitude: number) {
    if (!this.isValidLatitude(latitude)) {
      throw new Error("Invalid latitude. Must be between -90 and 90.");
    }
    if (!this.isValidLongitude(longitude)) {
      throw new Error("Invalid longitude. Must be between -180 and 180.");
    }

    this.latitude = latitude;
    this.longitude = longitude;
  }

  private isValidLatitude(lat: number): boolean {
    return lat >= -90 && lat <= 90;
  }

  private isValidLongitude(lon: number): boolean {
    return lon >= -180 && lon <= 180;
  }
}
