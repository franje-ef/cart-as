using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Cartas.Web.Models
{
    public class IndexViewModel
    {
        public IEnumerable<GameItemViewModel> ActiveGames { get; set; }

    }
}