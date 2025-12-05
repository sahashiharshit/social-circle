import 'dotenv';
const cloudfronturl = process.env.CLOUDFRONT_DOMAIN;
export const FALLBACK_AVATAR=`${cloudfronturl}/defaultImage/useravatar.png`;