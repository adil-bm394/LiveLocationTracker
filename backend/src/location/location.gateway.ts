import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LocationService } from './location.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class LocationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private readonly locationService: LocationService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('location')
  async handleLocation(
    client: Socket,
    data: { latitude: number; longitude: number },
  ) {
    console.log(
      `[Location.Gateway] latitude:longitude=>:${data.latitude},${data.longitude}`,
    );
    try {
      await this.locationService.saveLocation(
        client.id,
        data.latitude,
        data.longitude,
      );
      console.log(`[Location.Gateway] Location saved for user ${client.id}`);
    } catch (error) {
      console.error('[Location.Gateway] Error saving location:', error);
    }
  }

  @SubscribeMessage('stopTracking')
  async handleStopTracking(client: Socket) {
    try {
      const totalDistance = await this.locationService.getTotalDistance(
        client.id,
      );
      console.log(
        `Total distance covered by ${client.id}: ${totalDistance} km`,
      );

      // SEND TOTAL DISTANCE BACK TO CLIENT
      client.emit('totalDistance', totalDistance);
    } catch (error) {
      console.error('[Location.Gateway] Error fetching total distance:', error);
    }
  }
}
