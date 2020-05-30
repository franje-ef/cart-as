using System;
using System.Collections.Generic;

namespace Cartas.Web.Domain.Models
{
    public class PotentialWinner
    {
        private readonly int _totalPlayers;
        private readonly int _votesNeeded;

        public PotentialWinner(int totalPlayers)
        {
            _totalPlayers = totalPlayers;
            _votesNeeded = (int) Math.Round((totalPlayers - 1) * 0.75);
        }

        public Player Player { get; set; }
        public string Snapshot { get; set; }
        public bool HasWon => _votes >= _votesNeeded;
        public bool HasLost => HasWon == false && _voters.Count == _totalPlayers - 1;

        private int _votes;
        private readonly List<string> _voters = new List<string>();

        public void React(string playerId, string reactionId)
        {
            if (Player.PlayerId == playerId)
                return;

            if (_voters.Contains(playerId))
                return;

            _voters.Add(playerId);

            switch (reactionId)
            {
                case "heart":
                case "like":
                case "super":
                    _votes++;
                    break;
            }
        }
    }
}