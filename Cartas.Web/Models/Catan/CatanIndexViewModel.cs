using System.Collections.Generic;

namespace Cartas.Web.Models.Catan
{
    public class CatanIndexViewModel
    {
        public IEnumerable<CatanGameItemViewModel> ActiveGames { get; set; }
    }
}
