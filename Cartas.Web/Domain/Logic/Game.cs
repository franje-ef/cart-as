using System.Collections.Generic;
using Cartas.Web.Domain.Models;

namespace Cartas.Web.Domain.Logic
{
    public class Game
    {
        public Game(string gameId, GameType gameType, Player masterPlayer)
        {
            GameId = gameId;
            GameType = gameType;
            MasterPlayer = masterPlayer;
            Players = new List<Player>
            {
                masterPlayer
            };
        }

        public string GameId { get; }
        public GameType GameType { get; }
        public Player MasterPlayer { get; }
        public List<Player> Players { get; }
    }
}