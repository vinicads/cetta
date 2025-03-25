import { Injectable, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginFunctions {
    constructor(
    private jwt: JwtService) { }

    async generateToken(email){
        var token = this.jwt.sign({email})
        return token
    }

    async generateTokenCode(code, email){
        var token = this.jwt.sign({code, email})
        return token
    }

    async verifyToken(token){
        var result
        try{
        const { email } = this.jwt.verify(token);
        result = {
            email
        };
        return result
    } catch (error) {
        result = null;
        return result;
    }
  
    }

}
