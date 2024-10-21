import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location } from 'src/schema/location.schema';

@Injectable()
export class LocationRepository {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<Location>,
  ) {}

  async findLastLocation(socketId: string): Promise<Location | null> {
    return this.locationModel
      .findOne({ socketId })
      .sort({ timestamp: -1 })
      .exec();
  }

  async saveLocation(location: Location): Promise<Location> {
    const newLocation = new this.locationModel(location);
    return newLocation.save();
  }

  async getTotalDistance(socketId: string): Promise<number> {
    const lastLocation = await this.findLastLocation(socketId);

    // Check if lastLocation is null and log the result
    if (!lastLocation) {
     // console.log(`[location Repository]No previous location found for socketId: ${socketId}`);
      return 0; 
    }

    console.log(
      '[Location Repository] Last location total distance:',
      lastLocation.totalDistance,
    );
    return lastLocation.totalDistance; 
  }
}
