namespace Cartas.Web.Domain.Catan.Models
{
    public class CatanPlayer
    {
        public string PlayerId { get; set; }
        public string PlayerName { get; set; }
        public string Avatar { get; set; }
        public int Seat { get; set; }
        public bool IsPlaying { get; set; }
    }
}
