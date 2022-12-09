import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../shared/AppError';
import { Repository } from '../../sellers/infra/Repository'


export async function ensureSellerIsAdmin(
    request: Request,
    _: Response,
    next: NextFunction,
): Promise<void> {
    const { id } = request.user

    const sellers = new Repository()

    const seller = await sellers.findById(id);

    if(seller?.isAdmin) {
        return next();
    } else {
        throw new AppError('Usuário não administrador', 401);
    }        
}