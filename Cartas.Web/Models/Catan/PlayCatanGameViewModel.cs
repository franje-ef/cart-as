using Cartas.Web.Domain.Catan.Logic;
using Cartas.Web.Domain.Catan.Models;

namespace Cartas.Web.Models.Catan
{
    public class PlayCatanGameViewModel
    {
        public CatanGame Game { get; set; }
        public CatanPlayer ThisPlayer { get; set; }
    }
}
