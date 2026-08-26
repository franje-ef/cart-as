using System.Collections.Generic;
using System.Linq;
using Cartas.Web.Domain.Catan.Models;

namespace Cartas.Web.Domain.Catan.Logic
{
    public class CatanGame
    {
        public CatanGame(string gameId, CatanPlayer masterPlayer)
        {
            GameId = gameId;
            MasterPlayer = masterPlayer;
            ActivePlayers = new List<CatanPlayer>();
            WaitingPlayers = new List<CatanPlayer>();
            AddPlayer(masterPlayer);
        }

        public string GameId { get; }
        public bool Started { get; set; }
        public bool Finished { get; set; }
        public CatanPlayer MasterPlayer { get; }
        public List<CatanPlayer> ActivePlayers { get; private set; }
        public List<CatanPlayer> WaitingPlayers { get; }

        public int PlayerCount => ActivePlayers.Count + WaitingPlayers.Count;

        public bool AddPlayer(CatanPlayer player)
        {
            if (ActivePlayers.Any(x => x.PlayerId == player.PlayerId)) return true;
            if (WaitingPlayers.Any(x => x.PlayerId == player.PlayerId)) return true;
            if (PlayerCount >= CatanConstants.MaxPlayers) return false;

            var takenSeats = ActivePlayers.Union(WaitingPlayers).Select(x => x.Seat).ToList();
            player.Seat = CatanConstants.Seats.First(x => !takenSeats.Contains(x));

            if (Started)
            {
                player.IsPlaying = false;
                WaitingPlayers.Add(player);
            }
            else
            {
                player.IsPlaying = true;
                ActivePlayers.Add(player);
            }

            return true;
        }

        public CatanPlayer GetPlayer(string playerId)
        {
            return ActivePlayers.SingleOrDefault(x => x.PlayerId == playerId)
                   ?? WaitingPlayers.SingleOrDefault(x => x.PlayerId == playerId);
        }

        public void Start()
        {
            ActivePlayers.AddRange(WaitingPlayers);
            WaitingPlayers.Clear();
            ActivePlayers.ForEach(x => x.IsPlaying = true);
            Started = true;
            Finished = false;
        }

        public string RemovePlayer(int seat)
        {
            var playerInActive = ActivePlayers.SingleOrDefault(x => x.Seat == seat);
            var playerInWaiting = WaitingPlayers.SingleOrDefault(x => x.Seat == seat);

            if (playerInWaiting == null && playerInActive == null)
                return null;

            if (playerInWaiting != null)
                WaitingPlayers.RemoveAll(x => x.PlayerId == playerInWaiting.PlayerId);

            if (playerInActive != null)
                ActivePlayers.RemoveAll(x => x.PlayerId == playerInActive.PlayerId);

            return playerInActive?.PlayerId ?? playerInWaiting?.PlayerId;
        }
    }
}
