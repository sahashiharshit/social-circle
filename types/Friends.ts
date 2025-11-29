
export type FriendList ={
    id: string;
    name: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    friendsCount: number;
}

export type Suggestions ={
    id: string;
    image: string | null;
    name: string;
}