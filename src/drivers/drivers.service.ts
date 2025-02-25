import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Driver, DriverDocument } from './schemas/driver.schema';

@Injectable()
export class DriversService {
  constructor(
    @InjectModel(Driver.name) private driverModel: Model<DriverDocument>,
  ) {}

  async createDriver(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string,
    carNumber: string,
  ): Promise<Driver> {
    const newDriver = new this.driverModel({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      carNumber,
    });
    return newDriver.save();
  }

  async findByEmail(email: string): Promise<Driver | null> {
    return this.driverModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<Driver | null> {
    return this.driverModel.findById(id).exec();
  }
}
