import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationService } from './location.service';
import { LocationGateway } from './location.gateway';
import { Location, LocationSchema } from 'src/schema/location.schema'; 
import { LocationRepository } from './repository/location.repository';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
  ],
  providers: [
    LocationService,
    LocationService,
    LocationGateway,
    LocationRepository,
  ],
})
export class LocationModule {}
