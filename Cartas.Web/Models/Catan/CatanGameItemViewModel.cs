using Cartas.Web.Domain.Catan;

namespace Cartas.Web.Models.Catan
{
    public class CatanGameItemViewModel
    {
        public string Id { get; set; }
        public int PlayerCount { get; set; }
        public bool CanJoin => PlayerCount < CatanConstants.MaxPlayers;
        public string MasterPlayer { get; set; }
    }
}
