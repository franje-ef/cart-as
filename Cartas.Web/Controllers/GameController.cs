using System.Collections.Generic;
using System.Web.Mvc;
using Cartas.Web.Models;

namespace Cartas.Web.Controllers
{
    public class GameController : Controller
    {
        public ActionResult Index()
        {
            var model = new IndexViewModel();
            model.ActiveGames = new List<GameItemViewModel>
            {
                new GameItemViewModel {PlayerCount = 10, Id = 12345, Type = "Romi"},
                new GameItemViewModel {PlayerCount = 7, Id = 123, Type = "Romi"},
                new GameItemViewModel {PlayerCount = 4, Id = 125, Type = "Romi"},
                new GameItemViewModel {PlayerCount = 1, Id = 129, Type = "Romi"},
                new GameItemViewModel {PlayerCount = 6, Id = 1230, Type = "Romi"},
                new GameItemViewModel {PlayerCount = 8, Id = 123400, Type = "Romi"},
                new GameItemViewModel {PlayerCount = 10, Id = 1234599, Type = "Romi"}
            };

            return View(model);
        }
    }
}