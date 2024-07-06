import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Controller('gateway')
export class GatewayController {
  private userClient: ClientProxy;
  private authClient: ClientProxy;

  constructor() {
    this.userClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3001 },
    });

    this.authClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3002 },
    });
  }

  @Get('users')
  getUsers() {
    return this.userClient.send({ cmd: 'get_users' }, {});
  }

  @Get('users/:id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userClient.send({ cmd: 'get_user' }, id)
  }

  @Get('validate/:email')
  validateUser(@Param('email') email: string) {
    const res =  this.authClient.send({ cmd: 'validate_user' }, email);
    if(!res) return {
      status: 404,
      message: "Not Found"
    }
    return res;
  }
}
