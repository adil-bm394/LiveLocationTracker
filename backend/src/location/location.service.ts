import { Injectable } from '@nestjs/common';
import { Location } from 'src/schema/location.schema';
import { LocationRepository } from './repository/location.repository';

@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository) {}

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  async saveLocation(
    socketId: string,
    latitude: number,
    longitude: number,
  ): Promise<Location> {
    const lastLocation =
      await this.locationRepository.findLastLocation(socketId);

    let totalDistance = 0;

    if (lastLocation) {
      const distance = this.calculateDistance(
        lastLocation.latitude,
        lastLocation.longitude,
        latitude,
        longitude,
      );
      totalDistance = lastLocation.totalDistance + distance;
    }

    const newLocation = {
      socketId,
      latitude,
      longitude,
      totalDistance,
    } as Location;

    return this.locationRepository.saveLocation(newLocation);
  }

  // GET TOTAL DISTANCE COVERED BY PERSON
  async getTotalDistance(socketId: string): Promise<number> {
    return this.locationRepository.getTotalDistance(socketId);
  }
}
