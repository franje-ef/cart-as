using Microsoft.AspNetCore.Mvc;

namespace Cartas.Web.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}
