namespace Cartas.Web.Domain.Models
{
    public class Player
    {
        public string PlayerId { get; set; }
        public string PlayerName { get; set; }
        public string Avatar { get; set; }
        public int Seat { get; set; }
        public int WinCount { get; set; }
    }
}