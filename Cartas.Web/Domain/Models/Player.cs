using System.Collections.Generic;

namespace Cartas.Web.Domain.Models
{
    public class Player
    {
        public Player()
        {
            Cards = new List<Card>();
        }

        public string PlayerId { get; set; }
        public string PlayerName { get; set; }
        public string Avatar { get; set; }
        public int Seat { get; set; }
        public int WinCount { get; set; }
        public List<Card> Cards { get; set; }
    }
}