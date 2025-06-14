import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class TaxiGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('TaxiGateway');
  private drivers: Map<
    string,
    { socket: Socket; location: { lat: number; lng: number } }
  > = new Map();

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.drivers.delete(client.id);
  }

  @SubscribeMessage('registerDriver')
  handleRegisterDriver(client: Socket, location: { lat: number; lng: number }) {
    this.drivers.set(client.id, { socket: client, location });
    this.logger.log(`Driver registered: ${client.id}`);
  }

  @SubscribeMessage('requestTaxi')
  handleRequestTaxi(
    client: Socket,
    data: {
      location: { lat: number; lng: number };
      destination: { lat: number; lng: number };
    },
  ) {
    this.logger.log(`Taxi requested by: ${client.id}`);
    this.findNearestDriver(client, data.location, data.destination);
  }

  private findNearestDriver(
    client: Socket,
    userLocation: { lat: number; lng: number },
    destination: { lat: number; lng: number },
  ) {
    let nearestDriver: {
      socket: Socket;
      location: { lat: number; lng: number };
    } | null = null;
    let minDistance = Infinity;

    this.drivers.forEach((driver) => {
      const distance = this.calculateDistance(userLocation, driver.location);
      if (distance < minDistance) {
        minDistance = distance;
        nearestDriver = driver;
      }
    });

    if (nearestDriver) {
      nearestDriver.socket.emit('rideRequest', {
        userId: client.id,
        location: userLocation,
        destination,
      });
    } else {
      client.emit('noDriversAvailable');
    }
  }

  private calculateDistance(
    loc1: { lat: number; lng: number },
    loc2: { lat: number; lng: number },
  ): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(loc2.lat - loc1.lat);
    const dLng = this.deg2rad(loc2.lng - loc1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(loc1.lat)) *
        Math.cos(this.deg2rad(loc2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
