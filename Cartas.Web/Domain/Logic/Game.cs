using System.Collections.Generic;
using System.Linq;
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
            ActivePlayers = new List<Player>();
            WaitingPlayers = new List<Player>();

            AddPlayer(masterPlayer);
        }

        public string GameId { get; }
        public GameType GameType { get; }
        public Player MasterPlayer { get; }
        public List<Player> ActivePlayers { get; }
        public List<Player> WaitingPlayers { get; }
        public bool Started { get; set; }

        private int PlayerCount => ActivePlayers.Count + WaitingPlayers.Count;

        public bool AddPlayer(Player player)
        {
            if (ActivePlayers.Any(x => x.PlayerId == player.PlayerId)) return true;
            if (WaitingPlayers.Any(x => x.PlayerId == player.PlayerId)) return true;
            if (PlayerCount > Constants.MaxPlayers) return false;

            player.Seat = Constants.Seats[PlayerCount];

            if (Started)
            {
                WaitingPlayers.Add(player);
            }
            else
            {
                ActivePlayers.Add(player);
            }

            return true;
        }

        public Player GetPlayer(string playerId)
        {
            return ActivePlayers.SingleOrDefault(x => x.PlayerId == playerId)
                   ?? WaitingPlayers.SingleOrDefault(x => x.PlayerId == playerId);
        }
    }
}