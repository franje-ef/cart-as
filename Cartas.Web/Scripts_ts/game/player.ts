class Player {
    playerId: string;
    playerName: string;
    avatar: string;
    seat: number;
    winCount: number;

    constructor(playerId: string, playerName: string, avatar: string, seat: number, winCount: number) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.avatar = avatar;
        this.seat = seat;
        this.winCount = winCount;
    } 
}