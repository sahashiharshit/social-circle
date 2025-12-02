
export type FriendList ={
    id: string;
    name: string;
    image: string | null;
    
}

export type Suggestions ={
    id: string;
    image: string | null;
    name: string;
}
export type IncomingRequest={
    id:string;
    requester:FriendList;
}