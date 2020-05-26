using System;
using System.Collections.Generic;

namespace Cartas.Web.Domain.Models
{
    public class PotentialWinner
    {
        private int _votesNeeded;

        public PotentialWinner(int totalPlayers)
        {
            _votesNeeded = (int) Math.Round((totalPlayers - 1) * 0.75);
        }

        public Player Player { get; set; }
        public string Snapshot { get; set; }

        private int _votes;
        private readonly List<string> _voters = new List<string>();

        public bool React(string playerId, string reactionId)
        {
            if (Player.PlayerId == playerId)
                return false;

            if (_voters.Contains(playerId))
                return false;

            _voters.Add(playerId);

            switch (reactionId)
            {
                case "heart":
                case "like":
                case "super":
                    _votes++;
                    break;
            }

            return _votes >= _votesNeeded;
        }
    }
}