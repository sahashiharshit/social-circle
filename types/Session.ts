

export type ClientSession ={
    user:User;

}|null


export type FullSession = {
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null;
  };
} | null;

export type User = Pick<NonNullable<FullSession>['user'],'id'|"name"|"image">;