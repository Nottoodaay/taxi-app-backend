import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(
    userName: string,
    password: string,
    personalNumber: string,
    email: string,
    phoneNumber: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      userName,
      password: hashedPassword,
      personalNumber,
      email,
      phoneNumber,
    });
    return newUser.save();
  }

  async findOne(username: string): Promise<User | null> {
    return this.userModel.findOne({ userName: username }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
}
