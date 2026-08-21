using System.Collections.Generic;

namespace Cartas.Web.Models
{
    public class IndexViewModel
    {
        public IEnumerable<GameItemViewModel> ActiveGames { get; set; }

    }
}