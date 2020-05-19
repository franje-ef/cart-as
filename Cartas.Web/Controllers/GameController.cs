using System.Web.Mvc;

namespace Cartas.Web.Controllers
{
    public class GameController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}