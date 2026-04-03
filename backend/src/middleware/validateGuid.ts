import { Request, Response, NextFunction } from "express";

const GUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function validateGuidParam(param: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const value = req.params[param] as string;
        if (!GUID_REGEX.test(value)) {
            res.status(400).json({ error: `${param} must be a valid GUID` });
            return;
        }
        next();
    };
}
