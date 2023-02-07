export interface GroupMember {
    uid: string;
    email: string;
    group: Group;
}

type Group = 'vip-0' | 'vip-1' | 'vip-2' | 'vip-3' | 'any' | 'bot' | 'temporary';
