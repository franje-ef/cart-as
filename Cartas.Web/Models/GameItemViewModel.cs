using Cartas.Web.Domain;

namespace Cartas.Web.Models
{
    public class GameItemViewModel
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public int PlayerCount { get; set; }
        public bool CanJoin => PlayerCount < Constants.MaxPlayers;
    }
}