import { readFileSync } from 'fs';
import { join } from 'path';

/** Content-ID for inline logo in multipart emails (nodemailer `cid` must match). */
export const FAJE_EMAIL_LOGO_CID = 'faje-logo@faje';

export function loadFajeEmailLogoBuffer(): Buffer {
    return readFileSync(join(process.cwd(), 'app', 'icon.png'));
}
