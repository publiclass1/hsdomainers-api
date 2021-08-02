import { Response } from 'express'
import jwt from 'jsonwebtoken'
import { serialize } from 'superjson'
const secret = process.env.JWT_SECRET as string

export function jwtMiddleware(req: any, res: Response, next: CallableFunction) {

    const bearerHeaderToken = req.headers.authorization
    const token = bearerHeaderToken?.split(' ')
    if (!bearerHeaderToken || !token || token.length !== 2) {
        return res.status(401).send('Forbidden')
    }
    const bearerToken = token[1]
    jwt.verify(bearerToken, secret, (e: any, payload: any) => {
        if (e) {
            res.sendStatus(401)
        } else {
            req.user = payload
            next()
        }
    })

}

export function generateAccessToken(userData: any) {
    return jwt.sign(serialize(userData).json as object, secret, {
        expiresIn: '1y'
    })
}